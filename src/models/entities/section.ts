interface SectionBaseEntity {
  id: number,
  name: string,
  content: string,
  created_at: number,
  created_by_user_id: number
}

interface SectionCreateEntity extends Omit<SectionBaseEntity,
  "created_at"
> {}

interface SectionReadEntity extends Omit<SectionBaseEntity,
  "created_at" |
  "created_by_user_id"
> {}

interface SectionUpdateEntity extends Partial<SectionCreateEntity> {}

export type {
  SectionCreateEntity,
  SectionReadEntity,
  SectionUpdateEntity
};