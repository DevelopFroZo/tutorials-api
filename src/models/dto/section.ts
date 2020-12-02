import { SectionCreateEntity, SectionReadEntity, SectionUpdateEntity } from "../entities/section";

interface SectionCreateDTO extends Omit<SectionCreateEntity,
  "created_by_user_id"
> {}

interface SectionReadDTO extends SectionReadEntity {}

interface SectionUpdateDTO extends SectionUpdateEntity {}

export type {
  SectionCreateDTO,
  SectionReadDTO,
  SectionUpdateDTO
};