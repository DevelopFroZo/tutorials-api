import type { Client } from "@t";
import type { PossibleAnswerBaseDTO } from "@m/dto/possibleAnswer";

async function getByQuestionIds( client: Client, questionIds: number[] ): Promise<PossibleAnswerBaseDTO[]>{
  const { rows } = await client.query<PossibleAnswerBaseDTO>(
    `select id, owner_question_id, text, is_right, points, order_number
    from possible_answers
    where owner_question_id = any( $1 )
    order by order_number`,
    [ questionIds ]
  );

  return rows;
}

export {
  getByQuestionIds
};