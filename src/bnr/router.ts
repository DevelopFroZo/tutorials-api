import type { Express } from "express";

import { resolve } from "path";

import { scan } from "./scan";

let pages: string[] = [];

function scanPredicate( path: string ){
  return !path.match( /\/_/ );
}

function makeImport( path: string, srcPagesPath: string, buildPagesPath: string ){
  path = path.replace( srcPagesPath, buildPagesPath );
  path = path.replace( /\.ts$/, ".js" );
  path = resolve( path ).replace( /\\/g, "/" );

  return path;
}

function makeUri( path: string, buildPagesPath: string ){
  path = path.replace( buildPagesPath, "" );
  path = path.replace( /\.js$/, "" );
  path = path.replace( /\/index$/, "" );
  path = `/${path.replace( /^\//, "" )}`;
  path = path.replace( /\[(.*?)\]/g, ":$1" );

  return path;
}

function attachMiddlewares( server: any, method: string, uri: string, middlewares: Function[], isLog: boolean = false ){
  if( method !== "use" ){
    const attachMethod = method !== "del" ? method : "delete";

    server[ attachMethod ]( uri, middlewares );
  } else {
    server.use( uri, middlewares );
  }

  server._router.stack[ server._router.stack.length - 1 ].injectedUri = uri;

  if( isLog ){
    console.info( `> \x1b[36m[\x1b[31mROUTER\x1b[36m] Attaching \x1b[35m${middlewares.length} \x1b[36mmiddlewares to \x1b[35m${method.toUpperCase()} ${uri}\x1b[0m` );
  }
}

function attachFromFile( server: Express, path: string, buildPagesPath: string, isLog: boolean = false ){
  const exports_ = require( path );
  const methods = Object.keys( exports_ );

  if( methods.length === 0 ){
    delete require.cache[ path ];

    return;
  }

  const uri = makeUri( path, buildPagesPath );

  if( methods.includes( "use" ) ){
    attachMiddlewares( server, "use", uri, exports_[ "use" ], isLog );
  }

  if( methods.includes( "extras" ) ){ 
    for( const [ method, action, ...middlewares ] of exports_[ "extras" ] ){
      if( action === "before" ){
        attachMiddlewares( server, method, uri, middlewares, isLog );
      }
    }
  }

  for( const method of methods ){
    if( ![ "use", "extras" ].includes( method ) ){
      attachMiddlewares( server, method, uri, [ exports_[ method ] ], isLog );
    }
  }

  if( methods.includes( "extras" ) ){ 
    for( const [ method, action, ...middlewares ] of exports_[ "extras" ] ){
      if( action === "after" ){
        attachMiddlewares( server, method, uri, middlewares, isLog );
      }
    }
  }
}

function init( server: Express, srcPagesPath: string, buildPagesPath: string, isLog: boolean = false ){
  const pages_ = scan( srcPagesPath ).filter( scanPredicate ).map( page => makeImport( page, srcPagesPath, buildPagesPath ) );

  for( const page of pages_ ){
    attachFromFile( server, page, buildPagesPath, isLog );
  }

  pages = pages_;
}

function unattach( server: Express, paths: string[], buildPagesPath: string ){
  const uris = paths.map( path => {
    delete require.cache[ path ];

    return makeUri( path, buildPagesPath );
  } );

  if( server._router ){
    const filtered = server._router.stack.filter( ( layer: any ) => !uris.includes( layer.injectedUri ) );

    if( filtered.length < server._router.stack.length ){
      server._router.stack = filtered;
    }
  }
}

function attachFromFiles( server: Express, paths: string[], buildPagesPath: string ){
  for( const path of paths ){
    attachFromFile( server, path, buildPagesPath );
  }
}

function reloadFromFiles( server: Express, paths: string[], srcPagesPath: string, buildPagesPath: string ){
  paths = paths.filter( path => path.startsWith( buildPagesPath ) && !path.match( /\/_/ ) );

  if( paths.length === 0 ) return [];

  const pages_ = scan( srcPagesPath ).filter( scanPredicate ).map( page => makeImport( page, srcPagesPath, buildPagesPath ) );

  unattach( server, [ ...paths, ...pages.filter( page => !pages_.includes( page ) ) ], buildPagesPath );
  attachFromFiles( server, paths, buildPagesPath );

  pages = pages_;

  return paths.map( path => makeUri( path, buildPagesPath ) );
}

export { init, reloadFromFiles, makeUri };