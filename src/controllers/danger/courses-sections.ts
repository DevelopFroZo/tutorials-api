import type { EResponse } from "@t";

import { pool } from "@u/db/clients";
import { manyQuery } from "@u/db/_manyQuery";

async function post( {}, res: EResponse ){
  await pool.query(
    `insert into courses_sections( course_id, section_id, owner_course_section_id, order_number, level )
    values
      ( 1, 1, null, 1, 1 ),
      ( 1, 2, null, 2, 1 ),
      ( 1, 3, 2, 1, 2 ),
      ( 1, 4, 2, 2, 2 ),
      ( 1, 5, 4, 1, 3 ),
      ( 1, 6, 4, 2, 3 )`
  );

  res.sendStatus( 204 );
}

async function del( {}, res: EResponse ){
  const sqls = [
    "delete from courses_sections",
    "alter sequence courses_sections_id_seq restart"
  ];

  manyQuery( pool, sqls );

  res.sendStatus( 204 );
}

export {
  post,
  del
};