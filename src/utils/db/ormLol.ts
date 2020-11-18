import { Client, EntityNames } from "@t";

interface Fields {
  [key: string]: any
}

class ORMLol<T> {
  private client: Client;
  private table: EntityNames;
  private body: Fields;

  constructor( client: Client, table: EntityNames, body: T, exclude?: ( keyof T )[] ){
    const filteredBody: Fields = {};

    for( const [ key, value ] of Object.entries( body ) ){
      if( exclude && exclude.includes( key as keyof T ) ){
        continue;
      }

      filteredBody[ key ] = value;
    }

    this.client = client;
    this.table = table;
    this.body = filteredBody;
  }

  setField( field: string, param: any ){
    this.body[ field ] = param;
  }
  
  setFields( fields: Fields ){
    for( const [ field, param ] of Object.entries( fields ) ){
      this.setField( field, param );
    }
  }

  rename( oldField: string, newField: string ){
    if( oldField in this.body ){
      this.body[ newField ] = this.body[ oldField ];
      delete this.body[ oldField ];
    }
  }

  insert<T = any>( returningRaw?: string[] ){
    let returning = "";
    
    const [ fields, values, params ] = Object.entries( this.body ).reduce( ( res, [ field, param ] ) => {
      res[0].push( field );
      res[1].push( `$${res[0].length}` );
      res[2].push( param );
  
      return res;
    }, [ [], [], [] ] );

    if( returningRaw ){
      returning = `returning ${returningRaw}`;
    }

    return this.client.query<T>(
      `insert into ${this.table}(${fields})
      values(${values})
      ${returning}`,
      params
    );
  }

  async update<T = any>( conditionsRaw?: Fields ){
    const [ sets, params ] = Object.entries( this.body ).reduce( ( res, [ field, param ] ) => {
      res[1].push( param );
      res[0].push( `${field}=$${res[1].length}` );

      return res;
    }, [ [], [] ] );

    if( sets.length === 0 ){
      return;
    }

    let conditions = "";

    if( conditionsRaw ){
      conditions = Object.entries( conditionsRaw ).reduce( ( res, [ field, param ] ) => {
        params.push( param );
        res.push( `${field}=$${params.length}` );

        return res;
      }, [] ).join( " and " );

      conditions = `where ${conditions}`;
    }

    return await this.client.query<T>(
      `update ${this.table}
      set ${sets}
      ${conditions}`,
      params
    );
  }
}

export { ORMLol };