import type { ERequest, EResponse } from "@t";
import type { SectionCreateDTO, SectionReadDTO } from "@m/dto/section";

import * as sectionService from "@s/sectionService";

async function post(
  {
    session: { user_id },
    body
  }: ERequest<SectionCreateDTO>,
  res: EResponse<number>
){
  try{
    const id = await sectionService.createOne( body, user_id );

    res.json( { payload: id } );
  } catch( error ) {
    console.error( `> \x1b[31mFailed to create section\x1b[0m` );
    console.error( error );

    // #fix убрать error
    res.status( 503 ).json( {
      error: {
        message: "Failed to create section",
        meta: { error, message: error.message }
      }
    } );
  }
}

async function get( {}, res: EResponse<SectionReadDTO[]> ){
  try{
    const sections = await sectionService.getAll();

    res.json( { payload: sections } );
  } catch( error ) {
    console.error( `> \x1b[31mFailed to get sections\x1b[0m` );
    console.error( error );

    // #fix убрать error
    res.status( 503 ).json( {
      error: {
        message: "Failed to get sections",
        meta: { error, message: error.message }
      }
    } );
  }
}

export {
  post,
  get
};