import type { PossibleAnswerCreateDTO, PossibleAnswerReadDTO } from "@m/dto/possibleAnswer";

import { pool, Transaction } from "@u/db/clients";

import * as possibleAnswerRepository from "@r/possibleAnswerRepository";

async function createOne(
  possibleAnswer: PossibleAnswerCreateDTO,
  owner_question_id: number,
  created_by_user_id: number
): Promise<[number, number]>{
  const transaction = new Transaction();

  const result = await possibleAnswerRepository.createOne( transaction, {
    ...possibleAnswer,
    owner_question_id,
    created_by_user_id
  } );

  await transaction.end();

  return result;
}

async function getByQuestionId( questionId: number ): Promise<PossibleAnswerReadDTO[]>{
  const possibleAnswers = await possibleAnswerRepository.getByQuestionIds( pool, [ questionId ] );

  return possibleAnswers;
}

export {
  createOne,
  getByQuestionId
};