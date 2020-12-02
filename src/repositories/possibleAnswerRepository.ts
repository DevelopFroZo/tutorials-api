import { Client, EntityNames } from "@t";
import type { PossibleAnswerCreateEntity, PossibleAnswerReadEntity } from "@m/entities/possibleAnswer";

import { ORMLol } from "@u/db/ormLol";
import { getNextOrderNumber } from "@u/db/orderControl";

async function createOne( client: Client, possibleAnswer: PossibleAnswerCreateEntity ): Promise<[number, number]>{
  const { rowCount } = await client.query(
    `select 1
    from
      questions as q
      left join possible_answers as pa
      on q.id = pa.owner_question_id,
      questions_types as qt
    where
      q.id = $1 and
      ( 
        qt.name = 'single' and
        pa.is_right = true and
        $2 = true or
        qt.name = 'free'
      ) and
      q.question_type_id = qt.id
    group by q.id
    limit 1`,
    [ possibleAnswer.owner_question_id, possibleAnswer.is_right ]
  );

  if( rowCount === 1 ){
    return [ 1, null ];
  }

  const { owner_question_id } = possibleAnswer;
  const ormLol = new ORMLol( client, EntityNames.POSSIBLE_ANSWERS, possibleAnswer );
  const order_number = await getNextOrderNumber( client, EntityNames.POSSIBLE_ANSWERS, { owner_question_id } );

  ormLol.setFields( { order_number } );

  const { rows: [ { id } ] } = await ormLol.insert<{
    id: number
  }>( [ "id" ] );

  return [ null, id ];
}

async function getByQuestionIds( client: Client, questionIds: number[] ): Promise<PossibleAnswerReadEntity[]>{
  const { rows } = await client.query<PossibleAnswerReadEntity>(
    `select id, owner_question_id, text, is_right, points, order_number
    from possible_answers
    where owner_question_id = any( $1 )
    order by order_number`,
    [ questionIds ]
  );

  return rows;
}

export {
  createOne,
  getByQuestionIds
};