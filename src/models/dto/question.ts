import { QuestionCreateEntity, QuestionReadEntity } from "../entities/question";

interface QuestionCreateDTO extends Omit<QuestionCreateEntity,
  "owner_section_id" |
  "created_by_user_id"
> {}

interface QuestionReadDTO extends QuestionReadEntity {}

export type {
  QuestionCreateDTO,
  QuestionReadDTO
}