import type { Pool, PoolClient, QueryConfig, QueryResult, QueryResultRow } from "pg";

import { pool } from "./pool";

enum State {
  NOT_OPENED = "NOT OPENED",
  "OPENED" = "OPENED",
  "CLOSED" = "CLOSED"
}

class Transaction{
  private pool: Pool;
  private client: PoolClient;
  private state: State;
  private count: number;

  constructor( pool_?: Pool ){
    this.pool = pool_ || pool;
    this.client = null;
    this.state = State.NOT_OPENED;
    this.count = 0;
  }

  async end( mode: boolean = true ): Promise<void>{
    if( this.state !== State.OPENED ){
      return;
    }

    if( mode ){
      await this.client.query( "commit" );
    } else {
      await this.client.query( "rollback" );
    }

    this.client.release();
    this.state = State.CLOSED;
  }

  async open(): Promise<void>{
    if( this.state !== State.NOT_OPENED ){
      return;
    }

    try{
      this.client = await this.pool.connect();
      this.state = State.OPENED;
      await this.client.query( "begin" );
    } catch( error ) {
      await this.end( false );

      throw error;
    }
  }

  async query<T extends QueryResultRow = any, R extends any[] = any[]>(
    sql: string | QueryConfig<R>,
    data?: R
  ): Promise<QueryResult<T>>{
    if( this.state === State.CLOSED ){
      throw new Error( "Client released" );
    }

    await this.open();
    this.count++;

    try{
      const result = await this.client.query<T, R>( sql, data );

      return result;
    } catch( error ) {
      error.queryNumber = this.count;
      await this.end( false );

      throw error;
    }
  }
}

export { Transaction };