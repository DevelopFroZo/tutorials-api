import type { Server } from "http";
import type { Express } from "express";

import { createServer } from "http";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import pgStoreConnect from "connect-pg-simple";

import { initConfigs } from "./utils/initConfigs";
import { initPool, pool } from "./utils/db/pool";

import { defaultSession } from "./utils/middlewares/defaultSession";

export default async function index( initialize: ( server: Server, app: Express ) => void ){
  const { PORT, NODE_ENV, NODE_PRESET } = process.env;
  const dev = NODE_ENV === "development";

  try{
    initConfigs( NODE_ENV, {
      root: "configs",
      preset: NODE_PRESET
    } );

    await initPool();
  } catch( error ) {
    console.error( "\x1b[30m\x1b[41m!!! Failed to load configuration or init database pool !!!\x1b[0m" );
    console.error( `\x1b[31m${error.message}\x1b[0m` );
    console.error( error );

    process.exit( -1 );
  }

  const pgStore = pgStoreConnect( session );
  const app = express();
  const server = createServer( app );

  app.use(
    cors( {
      credentials: true
    } ),
    helmet(),
    express.json(),
    express.urlencoded( {
      extended: true
    } ),
    session( {
      cookie: {
        httpOnly: true,
        maxAge: !dev ? parseInt( process.env.SESSION_COOKIE_MAXAGE ) : null,
        secure: !dev && process.env.SESSION_COOKIE_SECURE === "true"
      },
      name: !dev ? process.env.SESSION_NAME : null,
      resave: false,
      rolling: true,
      saveUninitialized: false,
      secret: !dev ? process.env.SESSION_SECRET : "secret",
      store: new pgStore( {
        pool,
        tableName: process.env.SESSION_TABLE_NAME
      } )
    } )
  );

  // #fix
  if( true || dev ){
    app.use( defaultSession );
  }

  initialize( server, app );

  server.listen( PORT, () => {
    console.log( `> \x1b[36mStarted \x1b[35m${NODE_ENV}\x1b[36m server on port \x1b[35m${PORT}\x1b[0m` );
  } );
}