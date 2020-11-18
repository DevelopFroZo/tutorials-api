import { CourseSectionDTO } from "./courseSection";

interface CourseBaseDTO {
  id: number,
  name: string,
  description: string
}

interface CourseCreateDTO extends Pick<CourseBaseDTO,
  "name" |
  "description"
> {}

interface CourseDTO extends CourseBaseDTO {
  structure: CourseSectionDTO[]
}

interface CourseUpdateDTO extends Partial<CourseCreateDTO> {}

export type {
  CourseBaseDTO,
  CourseCreateDTO,
  CourseDTO,
  CourseUpdateDTO
};