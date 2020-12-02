interface PossibleAnswerBaseEntity {
  id: number,
  owner_question_id: number,
  text: string,
  is_right: boolean,
  points: number,
  order_number: number,
  created_at: number,
  created_by_user_id: number
}

interface PossibleAnswerCreateEntity extends Omit<PossibleAnswerBaseEntity,
  "id" |
  "created_at"
> {}

interface PossibleAnswerReadEntity extends Omit<PossibleAnswerBaseEntity,
  "created_at" |
  "created_by_user_id"
> {}

export type {
  PossibleAnswerCreateEntity,
  PossibleAnswerReadEntity
};