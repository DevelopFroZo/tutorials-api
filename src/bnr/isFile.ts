import { lstatSync } from "fs";

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

export { isFile };