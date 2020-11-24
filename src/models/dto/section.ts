interface SectionBaseDTO {
  id: number,
  name: string,
  content: string
}

interface SectionCreateDTO extends Omit<SectionBaseDTO,
  "id"
> {}

interface SectionUpdateDTO extends Partial<SectionCreateDTO> {};

export type {
  SectionBaseDTO,
  SectionCreateDTO,
  SectionUpdateDTO
};