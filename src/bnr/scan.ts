import { readdirSync } from "fs";
import { resolve } from "path";

import { isFile } from "./isFile";

function scan( path: string ){
  const items = readdirSync( path );
  let result: string[] = [];

  for( const item of items ){
    const newPath = `${path}\\${item}`;

    if( isFile( newPath ) ){
      result.push( resolve( newPath ) );

      continue;
    }

    result = [ ...result, ...scan( newPath ) ];
  }

  return result;
}

export { scan };