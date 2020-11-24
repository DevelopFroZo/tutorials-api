import type { ERequest, EResponse } from "@t";
import type { SectionUpdateDTO } from "@m/dto/section";

import * as sectionService from "@s/sectionService";

async function put(
  {
    params: { id },
    body
  }: ERequest<SectionUpdateDTO>,
  res: EResponse
){
  try{
    await sectionService.updateOne( Number( id ), body );

    res.sendStatus( 204 );
  } catch( error ) {
    console.error( `> \x1b[31mFailed to update section\x1b[0m` );
    console.error( error );

    // #fix убрать error
    res.status( 503 ).json( {
      error: {
        message: "Failed to update section",
        meta: { error, message: error.message }
      }
    } );
  }
}

export {
  put
};