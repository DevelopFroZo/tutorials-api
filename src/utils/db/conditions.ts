interface Options {
  fields?: object,
  params?: any[]
}

class Conditions {
  private fields: object = {};
  private params: any[];

  constructor( { fields, params = [] }: Options = {} ){
    if( fields ){
      for( const [ key, value ] of Object.entries( fields ) ){
        this.fields[ key ] = {
          value,
          operator: "="
        };
      }
    }

    this.params = params;
  }

  set( field: string, value: any, operator: string = "=" ){
    this.fields[ field ] = { value, operator };
  }

  make( mode: "and" | "or", includeWhere: boolean = true ): [string, any[]]{
    const where = includeWhere ? "where " : "";
    let conditions = "";

    if( this.fields ){
      conditions = Object.entries( this.fields ).map( ( [ key, { value, operator } ] ) => {
        if( value !== null ){
          this.params.push( value );

          return `${key}${operator}$${this.params.length}`;
        } else {
          return `${key} is null`;
        }
      } ).join( ` ${mode} ` );

      conditions = `${where}${conditions}`;
    }

    return [ conditions, this.params ];
  }
}

export { Conditions };