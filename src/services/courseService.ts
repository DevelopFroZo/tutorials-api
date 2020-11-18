import type { CourseCreateDTO, CourseDTO, CourseUpdateDTO } from "@m/dto/courses";

import { pool, Transaction } from "@u/db/clients";

import * as courseRepository from "@r/courseRepository";
import * as courseSectionRepository from "@r/courseSectionRepository";

import { createMap } from "@u/merger";

async function createOne( course: CourseCreateDTO, created_by_user_id: number ): Promise<number>{
  const transaction = new Transaction();

  const id = await courseRepository.createOne( transaction, {
    ...course,
    created_by_user_id
  } );

  await transaction.end();

  return id;
}

async function getAll(): Promise<CourseDTO[]>{
  const courses = await courseRepository.getAll( pool );

  return courses;
}

async function getFullById( courseId: number ): Promise<CourseDTO>{
  const course = await courseRepository.getById( pool, courseId );
  
  if( !course ){
    return course;
  }

  const courseSections = await courseSectionRepository.getByCourseIdWithSection( pool, courseId );

  if( courseSections.length > 0 ){
    const map = createMap( courseSections, "id" );
    let i = courseSections.length - 1;

    while( i > -1 ){
      const courseSection = courseSections[i];

      if( courseSection.owner_course_section_id ){
        const indexes = map[ courseSection.owner_course_section_id ];

        for( const index of indexes ){
          courseSections[ index ].nested_sections.unshift( courseSection );
        }

        courseSections.splice( i, 1 );
      }

      i--;
    }
  }

  course.structure = courseSections;

  return course;
}

async function updateOne( courseId: number, course: CourseUpdateDTO ): Promise<void>{
  await courseRepository.updateOne( pool, courseId, course );
}

async function deleteOne( courseId: number ): Promise<void>{
  await courseRepository.deleteOne( pool, courseId );
}

export {
  createOne,
  getFullById,
  getAll,
  updateOne,
  deleteOne
};