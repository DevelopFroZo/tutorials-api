interface CourseSectionBaseEntity {
  id: number,
  course_id: number,
  section_id: number,
  owner_course_section_id: number,
  order_number: number,
  level: number
}

interface CourseSectionCreateEntity extends Omit<CourseSectionBaseEntity,
  "id" |
  "level"
> {}

interface CourseSectionReadEntity extends Omit<CourseSectionBaseEntity,
  "course_id" |
  "level"
> {
  level_name: string,
  nested_course_sections?: CourseSectionReadEntity[]
}

export type {
  CourseSectionCreateEntity,
  CourseSectionReadEntity
};