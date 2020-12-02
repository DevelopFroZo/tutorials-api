import type { EResponse } from "@t";

import { pool } from "@u/db/clients";
import { manyQuery } from "@u/db/_manyQuery";

async function post( {}, res: EResponse ){
  await pool.query(
    `insert into questions( owner_section_id, question_type_id, text, order_number, created_at, created_by_user_id )
    values
      ( 1, 1, 'Section 1. Question 1', 1, 1605365231, 1 ),
      ( 1, 2, 'Section 1. Question 2', 2, 1605365231, 1 ),
      ( 1, 3, 'Section 1. Question 3', 3, 1605365231, 1 ),

      ( 3, 1, 'Section 3. Question 1', 1, 1605365231, 1 ),
      ( 3, 2, 'Section 3. Question 2', 2, 1605365231, 1 ),
      ( 3, 3, 'Section 3. Question 3', 3, 1605365231, 1 ),

      ( 5, 1, 'Section 5. Question 1', 1, 1605365231, 1 ),
      ( 5, 2, 'Section 5. Question 2', 2, 1605365231, 1 ),
      ( 5, 3, 'Section 5. Question 3', 3, 1605365231, 1 )`
  );

  res.sendStatus( 204 );
}

async function del( {}, res: EResponse ){
  const sqls = [
    "delete from questions",
    "alter sequence questions_id_seq restart"
  ];

  manyQuery( pool, sqls );

  res.sendStatus( 204 );
}

export {
  post,
  del
};