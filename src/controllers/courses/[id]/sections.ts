import type { ERequest, EResponse } from "@t";
import type { CourseSectionCreateDTO } from "@m/dto/courseSection";

import * as courseSectionService from "@s/courseSectionService";

async function post(
  {
    params: { id },
    body
  }: ERequest<CourseSectionCreateDTO>,
  res: EResponse<number>
){
  try{
    const id_ = await courseSectionService.createOne( body, Number( id ) );

    res.json( { payload: id_ } );
  } catch( error ) {
    console.error( `> \x1b[31mFailed to create course section\x1b[0m` );
    console.error( error );

    // #fix убрать error
    res.status( 503 ).json( {
      error: {
        message: "Failed to create course section",
        meta: { error, message: error.message }
      }
    } );
  }
}

export {
  post
};