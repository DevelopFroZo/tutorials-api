import { Client, EntityNames } from "@t";
import type { CourseSectionCreateEntity } from "@m/entities/courseSection";
import type { CourseSectionHierarchicalDTO, CourseSectionUpdateDTO } from "@m/dto/courseSection";

import { getNextOrderNumber } from "@u/db/orderControl";
import { ORMLol } from "@u/db/ormLol";

async function getLevelByCourseIdAndOwnerCourseSectionId(
  client: Client,
  courseId: number,
  ownerCourseSectionId: number
): Promise<number>{
  const { rows: [ row ] } = await client.query<{
    level: number
  }>(
    `select level + 1 as level
    from courses_sections
    where
      course_id = $1 and
      id = $2`,
    [ courseId, ownerCourseSectionId ]
  );

  return row?.level || 1;
}

async function createOne( client: Client, course: CourseSectionCreateEntity ): Promise<number>{
  const { course_id, owner_course_section_id } = course;
  const ormLol = new ORMLol( client, EntityNames.COURSES_SECTIONS, course );

  const order_number = await getNextOrderNumber( client, EntityNames.COURSES_SECTIONS, {
    course_id,
    owner_course_section_id
  } );

  const level = await getLevelByCourseIdAndOwnerCourseSectionId( client, course_id, owner_course_section_id );

  ormLol.setFields( { order_number, level } );

  const { rows: [ { id } ] } = await ormLol.insert<{
    id: number
  }>( [ "id" ] );

  return id;
}

async function getByCourseId( client: Client, courseId: number ): Promise<CourseSectionHierarchicalDTO[]>{
  const { rows } = await client.query<CourseSectionHierarchicalDTO>(
    `select
      cs.id, cs.section_id, cs.owner_course_section_id, cs.order_number,
      ln.name as level_name
    from
      courses_sections as cs,
      levels_names as ln
    where
      cs.course_id = $1 and
      cs.level = ln.level
    order by cs.level, cs.order_number`,
    [ courseId ]
  );

  return rows;
}

async function updateOne(
  client: Client,
  courseSectionId: number,
  courseSection: CourseSectionUpdateDTO
): Promise<void>{
  const ormLol = new ORMLol( client, EntityNames.COURSES_SECTIONS, courseSection );

  await ormLol.update( {
    id: courseSectionId
  } );
}

export {
  createOne,
  getByCourseId,
  updateOne
};