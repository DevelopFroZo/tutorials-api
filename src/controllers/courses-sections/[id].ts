import type { ERequest, EResponse } from "@t";
import type { CourseSectionUpdateDTO } from "@m/dto/courseSection";

import * as courseSectionService from "@s/courseSectionService";

async function put(
  {
    params: { id },
    body
  }: ERequest<CourseSectionUpdateDTO>,
  res: EResponse
){
  try{
    await courseSectionService.updateOne( Number( id ), body );

    res.sendStatus( 204 );
  } catch( error ) {
    console.error( `> \x1b[31mFailed to update course section\x1b[0m` );
    console.error( error );

    // #fix убрать error
    res.status( 503 ).json( {
      error: {
        message: "Failed to update course section",
        meta: { error, message: error.message }
      }
    } );
  }
}

export {
  put
};