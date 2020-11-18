import { lstatSync } from "fs";

import dotenv from "dotenv";

interface Options {
  root?: string,
  preset?: string,
  fallback?: boolean
}

function isFile( path: string ){
  try{
    return lstatSync( path ).isFile();
  } catch( error ) {
    if( error.errno === -4058 ){
      return false;
    }

    throw error;
  }
}

function initConfigs( NODE_ENV: string, options?: Options ){
  let root = options?.root || __dirname;
  let preset = options?.preset || "local";
  let fallback = options?.fallback || true;
  const possiblePaths = [
    `${root}/${preset}-${NODE_ENV}.env`,
    `${root}/${preset}/${NODE_ENV}.env`
  ];

  dotenv.config( { path: `${root}/.env` } );

  if( fallback ){
    possiblePaths.push( `${root}/${NODE_ENV}.env` );
  }

  for( const path of possiblePaths ){
    if( isFile( path ) ){
      dotenv.config( { path } );

      return;
    }
  }

  throw new Error( `Failed to load configs with preset \`${preset}\` and NODE_ENV \`${NODE_ENV}\`` );
}

export { initConfigs };