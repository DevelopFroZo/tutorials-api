interface CourseBaseDTO {
  id: number,
  name: string,
  description: string
}

interface CourseCreateDTO extends Omit<CourseBaseDTO,
  "id"
> {}

interface CourseUpdateDTO extends Partial<CourseCreateDTO> {}

export type {
  CourseBaseDTO,
  CourseCreateDTO,
  CourseUpdateDTO
};