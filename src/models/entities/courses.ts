import { CourseBaseDTO } from "../dto/courses";

interface CourseCreateEntity extends Omit<CourseBaseDTO,
  "id"
> {
  created_by_user_id: number
}

export type {
  CourseCreateEntity
};