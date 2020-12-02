import { CourseCreateEntity, CourseReadEntity, CourseUpdateEntity } from "../entities/course";

interface CourseCreateDTO extends Omit<CourseCreateEntity,
  "created_by_user_id"
> {}

interface CourseReadDTO extends CourseReadEntity {}

interface CourseUpdateDTO extends CourseUpdateEntity {}

export type {
  CourseCreateDTO,
  CourseReadDTO,
  CourseUpdateDTO
};