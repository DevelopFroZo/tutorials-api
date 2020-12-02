import type { SectionCreateDTO, SectionReadDTO, SectionUpdateDTO } from "@m/dto/section";

import { pool, Transaction } from "@u/db/clients";

import * as sectionRepository from "@r/sectionRepository";

async function createOne( section: SectionCreateDTO, created_by_user_id: number ): Promise<number>{
  const transaction = new Transaction();

  const id = await sectionRepository.createOne( transaction, {
    ...section,
    created_by_user_id
  } );

  await transaction.end();

  return id;
}

async function getAll(): Promise<SectionReadDTO[]>{
  const sections = await sectionRepository.getAll( pool );

  return sections;
}

async function updateOne( sectionId: number, section: SectionUpdateDTO ): Promise<void>{
  await sectionRepository.updateOne( pool, sectionId, section );
}

export {
  createOne,
  getAll,
  updateOne
};