function uncacheParents( childPath: string, dirname: string, exclude?: string[] ){
  let removed: string[] = [];

  for( const path in require.cache ){
    if( !path.startsWith( dirname ) || ( exclude && exclude.some( el => path.startsWith( el ) ) ) ) continue;

    if( require.cache[ path ]!.children.some( ( { id } ) => id === childPath ) ){
      removed.push( path );

      delete require.cache[ path ];

      removed = [ ...removed, ...uncacheParents( path, dirname, exclude ) ];
    }
  }

  return removed;
}

function uncacheFile( path: string, dirname: string, exclude?: string[] ){
  if( !( path in require.cache ) ) return [];

  delete require.cache[ path ];

  return uncacheParents( path, dirname, exclude );
}

export { uncacheFile };