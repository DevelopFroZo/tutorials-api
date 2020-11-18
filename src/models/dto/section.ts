interface SectionBaseDTO {
  id: number,
  name: string,
  content: string
}

interface SectionCreateDTO extends Pick<SectionBaseDTO,
  "name" |
  "content"
> {}

interface SectionUpdateDTO extends Partial<SectionCreateDTO> {};

export type {
  SectionBaseDTO,
  SectionCreateDTO,
  SectionUpdateDTO
};