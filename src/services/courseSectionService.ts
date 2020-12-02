import type { CourseSectionCreateDTO, CourseSectionReadDTO } from "@m/dto/courseSection";

import { pool, Transaction } from "@u/db/clients";

import * as courseSectionRepository from "@r/courseSectionRepository";

import { createMap } from "@u/merger";

function makeHierarchical( courseSections: CourseSectionReadDTO[] ): void{
  const mapForStructure = createMap( courseSections, "id" );
  let i = courseSections.length - 1;

  while( i > -1 ){
    const courseSection = courseSections[i];

    if( courseSection.owner_course_section_id ){
      const indexes = mapForStructure[ courseSection.owner_course_section_id ];

      for( const index of indexes ){
        courseSections[ index ].nested_course_sections.unshift( courseSection );
      }

      courseSections.splice( i, 1 );
    }

    i--;
  }
}

async function createOne( courseSection: CourseSectionCreateDTO, course_id: number ): Promise<number>{
  const { owner_course_section_id = null } = courseSection;
  const transaction = new Transaction();

  const id = await courseSectionRepository.createOne( transaction, {
    ...courseSection,
    course_id,
    owner_course_section_id
  } );

  await transaction.end();

  return id;
}

export {
  makeHierarchical,
  createOne
};