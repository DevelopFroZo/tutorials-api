import { Client, EntityNames } from "@t";
import { QuestionsTypes, QuestionCreateEntity, QuestionReadEntity } from "@m/entities/question";

import { getNextOrderNumber } from "@u/db/orderControl";
import { ORMLol } from "@u/db/ormLol";

async function getQuestionTypeIdByName( client: Client, questionType: QuestionsTypes ): Promise<number>{
  const { rows: [ row ] } = await client.query<{
    id: number
  }>(
    `select id
    from questions_types
    where name = $1`,
    [ questionType ]
  );

  if( !row ){
    return null;
  }

  return row.id;
}

async function createOne( client: Client, question: QuestionCreateEntity ): Promise<number>{
  const { owner_section_id, question_type } = question;
  const ormLol = new ORMLol( client, EntityNames.QUESTIONS, question, [ "question_type" ] );
  const question_type_id = await getQuestionTypeIdByName( client, question_type );
  const order_number = await getNextOrderNumber( client, EntityNames.QUESTIONS, { owner_section_id } );

  ormLol.setFields( { order_number, question_type_id } );

  const { rows: [ { id } ] } = await ormLol.insert<{
    id: number
  }>( [ "id" ] );

  return id;
}

async function getBySectionIds( client: Client, sectionIds: number[] ): Promise<QuestionReadEntity[]>{
  const { rows } = await client.query<QuestionReadEntity>(
    `select
      q.id, q.owner_section_id, q.text, q.order_number,
      qt.name as question_type
    from
      questions as q,
      questions_types as qt
    where
      q.owner_section_id = any( $1 ) and
      q.question_type_id = qt.id
    order by q.order_number`,
    [ sectionIds ]
  );

  return rows;
}

export {
  createOne,
  getBySectionIds
};