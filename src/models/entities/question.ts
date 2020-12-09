enum QuestionsTypes {
  SINGLE = "single",
  MULTIPLE = "multiple",
  FREE = "free"
}

interface QuestionBaseEntity {
  id: number,
  owner_section_id: number,
  question_type_id: number,
  text: string,
  complexity: number,
  order_number: number,
  created_at: number,
  created_by_user_id: number
}

interface QuestionCreateEntity extends Omit<QuestionBaseEntity,
  "id" |
  "question_type_id" |
  "created_at"
> {
  question_type: QuestionsTypes
}

interface QuestionReadEntity extends Omit<QuestionBaseEntity,
  "question_type_id" |
  "created_at" |
  "created_by_user_id"
> {
  question_type: string
}

export type {
  QuestionsTypes,
  QuestionCreateEntity,
  QuestionReadEntity
};