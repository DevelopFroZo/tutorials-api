import type { ERequest, EResponse } from "@t";
import type { CourseCreateDTO, CourseBaseDTO } from "@m/dto/courses";

import * as courseService from "@s/courseService";

async function post(
  {
    session: { user_id },
    body
  }: ERequest<CourseCreateDTO>,
  res: EResponse<number>
){
  try{
    const id = await courseService.createOne( body, user_id );

    res.json( { payload: id } );
  } catch( error ) {
    console.error( `> \x1b[31mFailed to create course\x1b[0m` );
    console.error( error );

    // #fix убрать error
    res.status( 503 ).json( {
      error: {
        message: "Failed to create course",
        meta: { error, message: error.message }
      }
    } );
  }
}

async function get( {}, res: EResponse<CourseBaseDTO[]> ){
  try{
    const courses = await courseService.getAll();

    res.json( { payload: courses } );
  } catch( error ) {
    console.error( `> \x1b[31mFailed to get courses\x1b[0m` );
    console.error( error );

    // #fix убрать error
    res.status( 503 ).json( {
      error: {
        message: "Failed to get courses",
        meta: { error, message: error.message }
      }
    } );
  }
}

export {
  post,
  get
};