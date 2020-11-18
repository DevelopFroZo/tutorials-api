import type { ERequest, EResponse } from "@t";
import type { CourseDTO, CourseUpdateDTO } from "@m/dto/courses";

import * as courseService from "@s/courseService";

async function get(
  {
    params: { id }
  }: ERequest<CourseDTO>,
  res: EResponse
){
  try{
    const course = await courseService.getFullById( Number( id ) );

    res.json( { payload: course } );
  } catch( error ) {
    console.error( `> \x1b[31mFailed to get full course\x1b[0m` );
    console.error( error );

    // #fix убрать error
    res.status( 503 ).json( {
      error: {
        message: "Failed to get full course",
        meta: { error, message: error.message }
      }
    } );
  }
}

async function put(
  {
    params: { id },
    body
  }: ERequest<CourseUpdateDTO>,
  res: EResponse
){
  try{
    await courseService.updateOne( Number( id ), body );

    res.sendStatus( 204 );
  } catch( error ) {
    console.error( `> \x1b[31mFailed to update course\x1b[0m` );
    console.error( error );

    // #fix убрать error
    res.status( 503 ).json( {
      error: {
        message: "Failed to update course",
        meta: { error, message: error.message }
      }
    } );
  }
}

async function del(
  {
    params: { id }
  }: ERequest,
  res: EResponse
){
  try{
    await courseService.deleteOne( Number( id ) );

    res.sendStatus( 204 );
  } catch( error ) {
    console.error( `> \x1b[31mFailed to delete section\x1b[0m` );
    console.error( error );

    // #fix убрать error
    res.status( 503 ).json( {
      error: {
        message: "Failed to delete section",
        meta: { error, message: error.message }
      }
    } );
  }
}

export {
  get,
  put,
  del
};