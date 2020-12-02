import type { EResponse } from "@t";

import { pool } from "@u/db/clients";
import { manyQuery } from "@u/db/_manyQuery";

async function post( {}, res: EResponse ){
  await pool.query(
    `insert into possible_answers( owner_question_id, text, is_right, points, order_number, created_at, created_by_user_id )
    values
      ( 1, 'Section 1. Question 1. Possible answer 1 (false)', false, 1, 1, 1605365231, 1 ),
      ( 1, 'Section 1. Question 1. Possible answer 2 (true)',   true, 1, 2, 1605365231, 1 ),
      ( 1, 'Section 1. Question 1. Possible answer 3 (false)', false, 1, 3, 1605365231, 1 ),
      ( 1, 'Section 1. Question 1. Possible answer 4 (false)', false, 1, 4, 1605365231, 1 ),
      
      ( 2, 'Section 1. Question 2. Possible answer 1 (false)', false, 1, 1, 1605365231, 1 ),
      ( 2, 'Section 1. Question 2. Possible answer 2 (true)',   true, 1, 2, 1605365231, 1 ),
      ( 2, 'Section 1. Question 2. Possible answer 3 (true)',   true, 1, 3, 1605365231, 1 ),
      ( 2, 'Section 1. Question 2. Possible answer 4 (false)', false, 1, 4, 1605365231, 1 ),
      
      ( 4, 'Section 3. Question 1. Possible answer 1 (false)', false, 1, 1, 1605365231, 1 ),
      ( 4, 'Section 3. Question 1. Possible answer 2 (true)',   true, 1, 2, 1605365231, 1 ),
      ( 4, 'Section 3. Question 1. Possible answer 3 (false)', false, 1, 3, 1605365231, 1 ),
      ( 4, 'Section 3. Question 1. Possible answer 4 (false)', false, 1, 4, 1605365231, 1 ),
      
      ( 5, 'Section 3. Question 2. Possible answer 1 (false)', false, 1, 1, 1605365231, 1 ),
      ( 5, 'Section 3. Question 2. Possible answer 2 (true)',   true, 1, 2, 1605365231, 1 ),
      ( 5, 'Section 3. Question 2. Possible answer 3 (true)',   true, 1, 3, 1605365231, 1 ),
      ( 5, 'Section 3. Question 2. Possible answer 4 (false)', false, 1, 4, 1605365231, 1 ),
      
      ( 7, 'Section 5. Question 1. Possible answer 1 (false)', false, 1, 1, 1605365231, 1 ),
      ( 7, 'Section 5. Question 1. Possible answer 2 (true)',   true, 1, 2, 1605365231, 1 ),
      ( 7, 'Section 5. Question 1. Possible answer 3 (false)', false, 1, 3, 1605365231, 1 ),
      ( 7, 'Section 5. Question 1. Possible answer 4 (false)', false, 1, 4, 1605365231, 1 ),
      
      ( 8, 'Section 5. Question 2. Possible answer 1 (false)', false, 1, 1, 1605365231, 1 ),
      ( 8, 'Section 5. Question 2. Possible answer 2 (true)',   true, 1, 2, 1605365231, 1 ),
      ( 8, 'Section 5. Question 2. Possible answer 3 (true)',   true, 1, 3, 1605365231, 1 ),
      ( 8, 'Section 5. Question 2. Possible answer 4 (false)', false, 1, 4, 1605365231, 1 )`
  );

  res.sendStatus( 204 );
}

async function del( {}, res: EResponse ){
  const sqls = [
    "delete from possible_answers",
    "alter sequence possible_answers_id_seq restart"
  ];

  manyQuery( pool, sqls );

  res.sendStatus( 204 );
}

export {
  post,
  del
};