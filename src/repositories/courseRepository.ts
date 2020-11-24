import { Client, EntityNames } from "@t";
import type { CourseCreateEntity } from "@m/entities/courses";
import type { CourseBaseDTO, CourseUpdateDTO } from "@m/dto/courses";

import { ORMLol } from "@u/db/ormLol";

async function createOne( client: Client, course: CourseCreateEntity ): Promise<number>{
  const ormLol = new ORMLol( client, EntityNames.COURSES, course );

  const { rows: [ { id } ] } = await ormLol.insert<{
    id: number
  }>( [ "id" ] );

  return id;
}

async function getAll( client: Client ): Promise<CourseBaseDTO[]>{
  const { rows: courses } = await client.query(
    `select id, name, description
    from courses`
  );

  return courses;
}

async function getById( client: Client, courseId: number ): Promise<CourseBaseDTO>{
  const { rows: [ course = null ] } = await client.query<CourseBaseDTO>(
    `select id, name, description
    from courses
    where id = $1`,
    [ courseId ]
  );

  return course;
}

async function updateOne( client: Client, courseId: number, course: CourseUpdateDTO ): Promise<void>{
  const ormLol = new ORMLol( client, EntityNames.COURSES, course );

  await ormLol.update( {
    id: courseId
  } );
}

async function deleteOne( client: Client, courseId: number ): Promise<void>{
  await client.query(
    `delete from courses
    where id = $1`,
    [ courseId ]
  );
}

export {
  createOne,
  getAll,
  getById,
  updateOne,
  deleteOne
};