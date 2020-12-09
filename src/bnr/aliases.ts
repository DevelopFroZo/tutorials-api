import { readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";

import { scan } from "./scan";
import { matchedToArray } from "./matchedToArray";

export type alias = {
  test: RegExp,
  replacement: string
};

class Aliases {
  private _outDir: string;
  private _aliases: alias[];
  private _isLog: boolean;

  constructor( tsconfigPath: string, isLog: boolean = false ){
    const tsconfigDir = dirname( tsconfigPath );
    let { compilerOptions: { outDir, baseUrl, paths } } = JSON.parse( readFileSync( tsconfigPath, "utf8" ) );
    const aliases: alias[] = [];

    outDir = resolve( tsconfigDir, outDir || "." );

    for( let test in paths ){
      let replacement = resolve( outDir, paths[ test ][0] );
      let c = 1;

      replacement = replacement.replace( /\*/g, () => `$${c++}` ).replace( /\\/g, "/" );

      aliases.push( {
        test: new RegExp( `^${test.replace( /\*/g, "(.*)" )}` ),
        replacement
      } );
    }

    this._outDir = outDir;
    this._aliases = aliases;
    this._isLog = isLog;
  }

  replaceInPath( path: string ): [boolean, string]{
    let isModified = false;
  
    for( const { test, replacement } of this._aliases ){
      if( test.test( path ) ){
        isModified = true;
        path = path.replace( test, replacement );
  
        break;
      }
    }
  
    return [ isModified, path ];
  }

  replaceInFile( path: string ): boolean{
    let txt = readFileSync( path, "utf8" );
    let isModified = false;
  
    // const matched = txt.matchAll( /import.*from "(.*)"/g );
    const matched = matchedToArray( txt, /require.*"(.*)"/g );
    let offset = 0;
  
    for( const value of matched ){
      const [ isModified_, path_ ] = this.replaceInPath( value[1] );
  
      if( isModified_ ){
        isModified = isModified || isModified_;
  
        const index = value.index + value[0].indexOf( value[1] ) + offset;
  
        offset += path_.length - value[1].length;
        txt = `${txt.slice( 0, index )}${path_}${txt.slice( index + value[1].length )}`;
      }
    }
  
    if( isModified ){
      writeFileSync( path, txt );
  
      if( this._isLog ){
        console.log( path, this._outDir );
        console.info( `> \x1b[36m[\x1b[31mALIAS\x1b[36m] Modify \x1b[35m${path.replace( this._outDir, "" )}\x1b[0m` );
      }
    }

    return isModified;
  }

  replaceInOutDir(): string[]{
    const paths = scan( this._outDir );
    const modifiedPaths: string[] = [];
  
    for( const path of paths ){
      const isModified = this.replaceInFile( path );

      if( isModified ){
        modifiedPaths.push( path );
      }
    }

    return modifiedPaths;
  }
}

export { Aliases };