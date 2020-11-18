import { SectionBaseDTO } from "../dto/section";

interface TestCreateEntity extends Omit<SectionBaseDTO,
  "id"
> {
  created_by_user_id: number
}

export type {
  TestCreateEntity
};