import { Client, EntityNames } from "@t";
import type { SectionCreateEntity, SectionReadEntity, SectionUpdateEntity } from "@m/entities/section";

import { ORMLol } from "@u/db/ormLol";

async function createOne( client: Client, section: SectionCreateEntity ): Promise<number>{
  const ormLol = new ORMLol( client, EntityNames.SECTIONS, section );

  const { rows: [ { id } ] } = await ormLol.insert<{
    id: number
  }>( [ "id" ] );

  return id;
}

async function getAll( client: Client ): Promise<SectionReadEntity[]>{
  const { rows } = await client.query<SectionReadEntity>(
    `select id, name, content
    from sections`
  );

  return rows;
}

async function getByIds( client: Client, sectionIds: number[] ): Promise<SectionReadEntity[]>{
  const { rows } = await client.query<SectionReadEntity>(
    `select id, name, content
    from sections
    where id = any( $1 )`,
    [ sectionIds ]
  );

  return rows;
}

async function updateOne( client: Client, sectionId: number, section: SectionUpdateEntity ): Promise<void>{
  const ormLol = new ORMLol( client, EntityNames.SECTIONS, section );

  await ormLol.update( {
    id: sectionId
  } );
}

async function deleteOne( client: Client, sectionId: number ): Promise<void>{
  await client.query(
    `delete from sections
    where id = $1`,
    [ sectionId ]
  );
}

export {
  createOne,
  getAll,
  getByIds,
  updateOne,
  deleteOne
};