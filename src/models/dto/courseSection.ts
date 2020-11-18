import { SectionBaseDTO } from "./section";

interface CourseSectionBaseDTO {
  id: number,
  course_id: number,
  section_id: number,
  owner_course_section_id: number,
  order_number: number,
  level: number
}

interface CourseSectionCreateDTO extends Pick<CourseSectionBaseDTO,
  "section_id" |
  "owner_course_section_id"
> {}

interface CourseSectionDTO extends Pick<CourseSectionBaseDTO,
  "id" |
  "owner_course_section_id" |
  "order_number"
>, Omit<SectionBaseDTO,
  "id"
> {
  section_id: number,
  level_name: string,
  nested_sections: CourseSectionDTO[]
}

interface CourseSectionUpdateDTO extends Partial<CourseSectionCreateDTO> {
  course_id?: number
}

export type {
  CourseSectionBaseDTO,
  CourseSectionCreateDTO,
  CourseSectionDTO,
  CourseSectionUpdateDTO
};