import { CourseSectionBaseDTO } from "../dto/courseSection";

interface CourseSectionCreateEntity extends Omit<CourseSectionBaseDTO,
  "id"
> {}

export type {
  CourseSectionCreateEntity
};