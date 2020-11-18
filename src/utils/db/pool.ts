import type { PoolClient } from "pg";
import { Pool } from "pg";

let pool: Pool = null;

async function initPool(): Promise<void>{
  const {
    DB_CONN_USER: user,
    DB_CONN_PASSWORD: password,
    DB_CONN_HOST: host,
    DB_CONN_PORT: portString,
    DB_CONN_DATABASE: database
  } = process.env;

  const port = parseInt( portString );

  pool = new Pool( { user, password, host, port, database } );

  let client: PoolClient;
  
  try{
    client = await pool.connect();
    await client.query( "select now()" );
  } catch( error ) {
    throw error;
  } finally {
    if( client ){
      client.release();
    }
  }
}

export { pool, initPool };