import { Client } from "@t";

async function manyQuery( client: Client, sqls: string[] ){
  for( const sql of sqls ){
    await client.query( sql );
  }
}

export { manyQuery };