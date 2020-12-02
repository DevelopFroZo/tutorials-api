import { CourseSectionCreateEntity, CourseSectionReadEntity } from "../entities/courseSection";

interface CourseSectionCreateDTO extends Pick<CourseSectionCreateEntity,
  "section_id" |
  "owner_course_section_id" |
  "order_number"
> {}

interface CourseSectionReadDTO extends CourseSectionReadEntity {}

export type {
  CourseSectionCreateDTO,
  CourseSectionReadDTO
};