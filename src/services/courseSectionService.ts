import type { CourseSectionCreateDTO, CourseSectionUpdateDTO } from "@m/dto/courseSection";

import { pool, Transaction } from "@u/db/clients";

import * as courseSectionRepository from "@r/courseSectionRepository";

async function createOne( courseSection: CourseSectionCreateDTO, course_id: number ): Promise<number>{
  const { owner_course_section_id = null } = courseSection;
  const transaction = new Transaction();

  const id = await courseSectionRepository.createOne( transaction, {
    ...courseSection,
    course_id,
    owner_course_section_id,
    order_number: null,
    level: null
  } );

  await transaction.end();

  return id;
}

async function updateOne( courseSectionId: number, courseSection: CourseSectionUpdateDTO ): Promise<void>{
  await courseSectionRepository.updateOne( pool, courseSectionId, courseSection );
}

export {
  createOne,
  updateOne
};