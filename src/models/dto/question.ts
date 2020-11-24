enum QUESTION_TYPES {
  SINGLE = "single",
  MULTIPLE = "multiple",
  FREE = "free"
}

interface QuestionBaseDTO {
  id: number,
  owner_section_id: number,
  question_type: QUESTION_TYPES,
  text: string,
  order_number: number,
  time_limit: number
}

export {
  QuestionBaseDTO
};