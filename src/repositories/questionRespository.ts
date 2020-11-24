import type { Client } from "@t";
import type { QuestionBaseDTO } from "@m/dto/question";

async function getBySectionIds( client: Client, sectionIds: number[] ): Promise<QuestionBaseDTO[]>{
  const { rows } = await client.query<QuestionBaseDTO>(
    `select
      q.id, q.owner_section_id, q.text, q.order_number, q.time_limit,
      qt.name as question_type
    from
      questions as q,
      questions_types as qt
    where
      q.owner_section_id = any( $1 ) and
      q.question_type_id = qt.id`,
    [ sectionIds ]
  );

  return rows;
}

export {
  getBySectionIds
};