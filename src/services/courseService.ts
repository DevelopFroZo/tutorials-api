import type { CourseCreateDTO, CourseBaseDTO, CourseUpdateDTO } from "@m/dto/courses";

import { pool, Transaction } from "@u/db/clients";

import * as courseSectionService from "@s/courseSectionService";

import * as courseRepository from "@r/courseRepository";
import * as courseSectionRepository from "@r/courseSectionRepository";
import * as sectionRepository from "@r/sectionRepository";
import * as questionRespository from "@r/questionRespository";
import * as possibleAnswerRepository from "@r/possibleAnswerRepository";

import { createMap, mergeMultiple, mergeSingle } from "@u/merger";

async function createOne( course: CourseCreateDTO, created_by_user_id: number ): Promise<number>{
  const transaction = new Transaction();

  const id = await courseRepository.createOne( transaction, {
    ...course,
    created_by_user_id
  } );

  await transaction.end();

  return id;
}

async function getAll(): Promise<CourseBaseDTO[]>{
  const courses = await courseRepository.getAll( pool );

  return courses;
}

async function getById( courseId: number, include: ("sections" | "questions")[] = [] ){
  const course = await courseRepository.getById( pool, courseId );
  
  if( !course ){
    return null;
  }

  const courseSections = await courseSectionRepository.getByCourseId( pool, courseId );

  if( courseSections.length === 0 ){
    return course;
  }

  const courseWithStructure = { ...course, structure: [] };

  for( const entity of include ){
    let map = createMap( courseSections, "section_id" );
    const sectionIds = Object.keys( map ).map( Number );

    if( entity === "sections" ){
      const sections = await sectionRepository.getByIds( pool, sectionIds );

      mergeSingle( courseSections, sections, "id", "section", { map } );
    }
    else if( entity === "questions" ){
      const questions = await questionRespository.getBySectionIds( pool, sectionIds );

      if( questions.length > 0 ){
        mergeMultiple( courseSections, questions, "owner_section_id", "questions", { map } );
        map = createMap( questions, "id" );

        const questionIds = Object.keys( map ).map( Number );
        const possibleAnswers = await possibleAnswerRepository.getByQuestionIds( pool, questionIds );

        if( possibleAnswers.length > 0 ){
          mergeMultiple( questions, possibleAnswers, "owner_question_id", "possible_answers", { map } );
        }
      }
    }
  }

  courseSectionService.makeHierarchical( courseSections );
  courseWithStructure.structure = courseSections;

  return courseWithStructure;
}

async function updateOne( courseId: number, course: CourseUpdateDTO ): Promise<void>{
  await courseRepository.updateOne( pool, courseId, course );
}

async function deleteOne( courseId: number ): Promise<void>{
  await courseRepository.deleteOne( pool, courseId );
}

export {
  createOne,
  getById,
  getAll,
  updateOne,
  deleteOne
};