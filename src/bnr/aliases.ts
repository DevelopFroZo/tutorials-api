import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";

import { scan } from "./scan";
import { matchedToArray } from "./matchedToArray";

export type alias = {
  test: RegExp,
  replacement: string
};

class Aliases {
  private outDir: string;
  private aliases: alias[];
  private isLog: boolean;

  constructor( tsconfigPath: string, isLog: boolean = false ){
    const tsconfigDir = dirname( tsconfigPath );
    let { compilerOptions: { rootDir, outDir, baseUrl, paths } } = JSON.parse( readFileSync( tsconfigPath, "utf8" ) );
    const aliases: alias[] = [];

    rootDir = resolve( tsconfigDir, rootDir || "." ).replace( /\\/g, "/" );
    outDir = resolve( tsconfigDir, outDir || "." ).replace( /\\/g, "/" );
    baseUrl = baseUrl || ".";

    for( let test in paths ){
      let replacement = resolve( outDir, paths[ test ][0] ).replace( /\\/g, "/" );

      if( rootDir !== outDir ){
        replacement = replacement.replace( rootDir, outDir );
      }

      let c = 1;

      replacement = replacement.replace( /\*/g, () => `$${c++}` );

      aliases.push( {
        test: new RegExp( `^${test.replace( /\*/g, "(.*)" )}` ),
        replacement
      } );
    }

    this.outDir = outDir;
    this.aliases = aliases;
    this.isLog = isLog;
  }

  replaceInPath( path: string ): [boolean, string]{
    let isModified = false;
  
    for( const { test, replacement } of this.aliases ){
      if( test.test( path ) ){
        isModified = true;
        path = path.replace( test, replacement );
  
        break;
      }
    }
  
    return [ isModified, path ];
  }

  replaceInFile( path: string ){
    let txt = readFileSync( path, "utf8" );
    let isModified = false;
  
    // const matched = txt.matchAll( /import.*from "(.*)"/g );
    const matched = matchedToArray( txt, /require.*"(.*)"/g );
    let offset = 0;
  
    for( const value of matched ){
      const [ isModified_, path ] = this.replaceInPath( value[1] );
  
      if( isModified_ ){
        isModified = isModified_;
  
        const index = value.index + value[0].indexOf( value[1] ) + offset;
  
        offset += path.length - value[1].length;
        txt = `${txt.slice( 0, index )}${path}${txt.slice( index + value[1].length )}`;
      }
    }
  
    if( isModified ){
      writeFileSync( path, txt );
  
      if( this.isLog ){
        console.info( `> \x1b[36m[\x1b[31mALIAS\x1b[36m] Modify \x1b[35m${path.replace( `${this.outDir}/`, "" )}\x1b[0m` );
      }
    }
  }

  replaceInOutDir(){
    const paths = scan( this.outDir );
  
    for( const path of paths ){
      this.replaceInFile( path );
    }
  }
}

export { Aliases };