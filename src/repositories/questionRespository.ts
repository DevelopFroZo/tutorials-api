import type { Client } from "@t";
import type { QuestionBaseDTO } from "@m/dto/question";

async function getBySectionIds( client: Client, sectionIds: number[] ): Promise<QuestionBaseDTO[]>{
  const { rows } = await client.query<QuestionBaseDTO>(
    `select id, owner_section_id, text, order_number, time_limit
    from questions
    where owner_section_id = any( $1 )`,
    [ sectionIds ]
  );

  return rows;
}

export {
  getBySectionIds
};