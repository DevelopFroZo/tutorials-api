import { PossibleAnswerCreateEntity, PossibleAnswerReadEntity } from "../entities/possibleAnswer";

interface PossibleAnswerCreateDTO extends Omit<PossibleAnswerCreateEntity,
  "owner_question_id" |
  "created_by_user_id"
> {}

interface PossibleAnswerReadDTO extends PossibleAnswerReadEntity {}

export type {
  PossibleAnswerCreateDTO,
  PossibleAnswerReadDTO
};