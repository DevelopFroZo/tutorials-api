import type { Server } from "http";
import type { Express } from "express";

import { resolve } from "path";
import { watch } from "chokidar";

import { Aliases } from "./aliases";
import * as router from "./router";
import { isFile } from "./isFile";
import { uncacheFile } from "./uncacheFile";

const buildPath = resolve( "build" );
const serverPath = resolve( buildPath, "server.js" );
const srcRoutesPath = resolve( "src", "controllers" );
const buildRoutesPath = resolve( buildPath, "controllers" );
const utilsPath = resolve( buildPath, "bnr" );

async function startWatch(){
  const aliases = new Aliases( "tsconfig.json" );
  let server: Server;
  let app: Express;

  process.env.PORT = process.argv[2] || "3000";
  process.env.NODE_ENV = process.env[3] || "development";

  aliases.replaceInOutDir();

  await new Promise( res => {
    require( serverPath ).default( ( server_: Server, app_: Express ) => {
      server = server_;
      app = app_;
      res();
    } );
  } );

  router.init( app!, srcRoutesPath, buildRoutesPath );

  watch( buildPath, {
    ignoreInitial: true
  } ).on( "all", async ( _, path ) => {
    if( !isFile( path ) || path === __filename || !/\.(js|ts)/.test( path ) ){
      return;
    }

    aliases.replaceInOutDir();

    const uncachedFiles = uncacheFile( path, buildPath, [ utilsPath ] );

    if( !uncachedFiles.includes( path ) ){
      uncachedFiles.push( path );
    }

    if( uncachedFiles.includes( serverPath ) ){
      await new Promise( res => server.close( res ) );
      await new Promise( res => {
        require( serverPath ).default( ( server_: Server, app_: Express ) => {
          server = server_;
          app = app_;
          res();
        } );
      } );

      router.init( app, srcRoutesPath, buildRoutesPath );
    } else {
      const urisReloaded = router.reloadFromFiles( app, uncachedFiles, srcRoutesPath, buildRoutesPath );

      for( const uri of urisReloaded ){
        console.log( `> \x1b[36mReloaded \x1b[35m${uri}\x1b[0m` );
      }
    }
  } );
}

startWatch();