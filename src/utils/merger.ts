export {
  createMap,
  merge,
  mergeSingle,
  mergeMultiple
};

interface QueryResultRow {
  [key: string]: any
}

interface Map {
  [key: string]: number[]
}

interface Options {
  map?: Map,
  field?: string,
  remove?: boolean
}

function createMap<T extends QueryResultRow>( arr: T[], byKey: keyof T ){
  return arr.reduce( ( res, el, i ) => {
    const mapKey = el[ byKey ];

    if( !( mapKey in res ) ){
      res[ mapKey ] = [];
    }

    res[ mapKey ].push( i );

    return res;
  }, {} as Map );
}

function merge<T extends QueryResultRow, R extends QueryResultRow>(
  mergeType: "single" | "multiple",
  arr0: T[],
  arr1: R[],
  byKey: keyof R,
  newKey: string,
  { map, field: currentField, remove }: Options = {}
){
  if( !map ){
    map = createMap( arr0, byKey as keyof T );
  }

  if( currentField === "." ){
    currentField = newKey;
  }

  for( let field of arr1 ){
    const indexes = map[ field[ byKey ] ];

    if( currentField ){
      field = field[ currentField ];
    }
    else if( remove ){
      delete field[ byKey ];
    }

    for( const index of indexes ){
      const field_: QueryResultRow = arr0[ index ];

      if( mergeType === "single" ){
        field_[ newKey ] = field;
      } else {
        if( !Array.isArray( field_[ newKey ] ) ){
          field_[ newKey ] = [];
        }

        field_[ newKey ].push( field );
      }
    }
  }
}

function mergeSingle<T, R>( arr0: T[], arr1: R[], byKey: keyof R, newKey: string, options?: Options ){
  merge( "single", arr0, arr1, byKey, newKey, options );
}

function mergeMultiple<T, R>( arr0: T[], arr1: R[], byKey: keyof R, newKey: string, options?: Options ){
  merge( "multiple", arr0, arr1, byKey, newKey, options );
}