import { Client, EntityNames } from "@t";

interface ShiftOptions {
  start?: number,
  count?: number,
  byFields?: object
}

import { Conditions } from "./conditions";

async function getNextOrderNumber( client: Client, table: EntityNames, byFields?: object ): Promise<number>{
  const conditions = new Conditions( { fields: byFields } );
  const [ conditions_, params ] = conditions.make( "and" );

  const { rows: [ { order_number } ] } = await client.query<{ order_number: number }>(
    `select coalesce( max( order_number ), 0 ) + 1 as order_number
    from ${table}
    ${conditions_}`,
    params
  );

  return order_number;
}

async function shift( client: Client, table: EntityNames, direction: "left" | "right", {
  start = 1,
  count = 1,
  byFields
}: ShiftOptions = {} ){
  const params = [ count ];
  const conditions = new Conditions( { fields: byFields, params } );

  conditions.set( "order_number", start, ">=" );

  const [ conditions_, params_ ] = conditions.make( "and" );

  await client.query(
    `update ${table}
    set order_number=order_number${direction === "left" ? "-" : "+"}$1
    ${conditions_}`,
    params_
  );
}

export {
  getNextOrderNumber,
  shift
};