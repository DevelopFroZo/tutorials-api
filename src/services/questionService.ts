import type { QuestionCreateDTO, QuestionReadDTO } from "@m/dto/question";

import { pool, Transaction } from "@u/db/clients";

import * as questionRepository from "@r/questionRespository";

async function createOne(
  question: QuestionCreateDTO,
  owner_section_id: number,
  created_by_user_id: number
): Promise<number>{
  const transaction = new Transaction();

  const id = await questionRepository.createOne( transaction, {
    ...question,
    owner_section_id,
    created_by_user_id
  } );

  await transaction.end();

  return id;
}

async function getBySectionId( sectionId: number ): Promise<QuestionReadDTO[]>{
  const questions = await questionRepository.getBySectionIds( pool, [ sectionId ] );

  return questions;
}

export {
  createOne,
  getBySectionId
};