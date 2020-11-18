import type { EResponse } from "@t";

import { pool } from "@u/db/clients";
import { manyQuery } from "@u/db/_manyQuery";

async function post( {}, res: EResponse ){
  await pool.query(
    `insert into courses( name, description, created_at, created_by_user_id )
    values
      ( 'Course 1', 'Description 1', 1605365231, 1 ),
      ( 'Course 2', 'Description 2', 1605365231, 1 )`
  );

  res.sendStatus( 204 );
}

async function del( {}, res: EResponse ){
  const sqls = [
    "delete from courses",
    "alter sequence courses_id_seq restart"
  ];

  manyQuery( pool, sqls );

  res.sendStatus( 204 );
}

export {
  post,
  del
};