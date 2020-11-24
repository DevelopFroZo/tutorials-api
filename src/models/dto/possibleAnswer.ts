interface PossibleAnswerBaseDTO {
  id: number,
  owner_question_id: number,
  text: string,
  is_right: boolean,
  points: number,
  order_number: number
}

export {
  PossibleAnswerBaseDTO
};