import type { ERequest, EResponse } from "@t";
import type { QuestionCreateDTO, QuestionReadDTO } from "@m/dto/question";

import * as questionService from "@s/questionService";

async function post(
  {
    session: { user_id },
    params: { id },
    body
  }: ERequest<QuestionCreateDTO>,
  res: EResponse<number>
){
  try{
    const id_ = await questionService.createOne( body, Number( id ), user_id );

    res.json( { payload: id_ } );
  } catch( error ) {
    console.error( `> \x1b[31mFailed to create question for section\x1b[0m` );
    console.error( error );

    // #fix убрать error
    res.status( 503 ).json( {
      error: {
        message: "Failed to create question for section",
        meta: { error, message: error.message }
      }
    } );
  }
}

async function get(
  {
    params: { id }
  }: ERequest,
  res: EResponse<QuestionReadDTO[]>
){
  try{
    const questions = await questionService.getBySectionId( Number( id ) );

    res.json( { payload: questions } );
  } catch( error ) {
    console.error( `> \x1b[31mFailed to get questions\x1b[0m` );
    console.error( error );

    // #fix убрать error
    res.status( 503 ).json( {
      error: {
        message: "Failed to get questions",
        meta: { error, message: error.message }
      }
    } );
  }
}

export {
  post,
  get
};