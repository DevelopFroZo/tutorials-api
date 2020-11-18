import type { EResponse } from "@t";

import { pool } from "@u/db/clients";
import { manyQuery } from "@u/db/_manyQuery";

async function post( {}, res: EResponse ){
  await pool.query(
    `insert into sections( name, content, created_at, created_by_user_id )
    values
      ( 'Section 1', 'Fancy markdown content 1', 1605365231, 1 ),
      ( 'Section 2', 'Fancy markdown content 2', 1605365231, 1 ),
      ( 'Section 3', 'Fancy markdown content 3', 1605365231, 1 ),
      ( 'Section 4', 'Fancy markdown content 4', 1605365231, 1 ),
      ( 'Section 5', 'Fancy markdown content 5', 1605365231, 1 ),
      ( 'Section 6', 'Fancy markdown content 6', 1605365231, 1 )`
  );

  res.sendStatus( 204 );
}

async function del( {}, res: EResponse ){
  const sqls = [
    "delete from sections",
    "alter sequence sections_id_seq restart"
  ];

  manyQuery( pool, sqls );

  res.sendStatus( 204 );
}

export {
  post,
  del
};