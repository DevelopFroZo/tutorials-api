interface CourseBaseEntity {
  id: number,
  name: string,
  description: string,
  created_at: number,
  created_by_user_id: number
}

interface CourseCreateEntity extends Omit<CourseBaseEntity,
  "created_at"
> {}

interface CourseReadEntity extends Omit<CourseBaseEntity,
  "created_at" |
  "created_by_user_id"
> {}

interface CourseUpdateEntity extends Partial<CourseCreateEntity> {}

export type {
  CourseCreateEntity,
  CourseReadEntity,
  CourseUpdateEntity
};