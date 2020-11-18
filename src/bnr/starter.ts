import type { Express } from "express";

import { resolve } from "path";

import { Aliases } from "./aliases";
import * as router from "./router";

const buildPath = resolve( "build" );
const serverPath = resolve( buildPath, "server.js" );
const srcRoutesPath = resolve( "src", "controllers" );
const buildRoutesPath = resolve( buildPath, "controllers" );

async function index(){
  const PORT = Number( process.argv[2] );

  if( isNaN( PORT ) || typeof PORT !== "number" || PORT < 0 ){
    console.error( "\x1b[30m\x1b[41m!!! Send valid port to \x1b[46mfirst\x1b[41m argument !!!\x1b[0m" );

    process.exit( -1 );
  }

  process.env.PORT = `${PORT}`;
  process.env.NODE_ENV = "production";

  const aliases = new Aliases( "tsconfig.json", true );

  aliases.replaceInOutDir();

  await require( serverPath ).default( ( {}, app: Express ) => {
    router.init( app, srcRoutesPath, buildRoutesPath, true );
  } );
}

index();