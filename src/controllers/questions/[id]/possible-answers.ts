import type { ERequest, EResponse } from "@t";
import type { PossibleAnswerCreateDTO, PossibleAnswerReadDTO } from "@m/dto/possibleAnswer";

import * as possibleAnswerService from "@s/possibleAnswerService";

async function post(
  {
    session: { user_id },
    params: { id },
    body
  }: ERequest<PossibleAnswerCreateDTO>,
  res: EResponse<number>
){
  try{
    const [ error, id_ ] = await possibleAnswerService.createOne( body, Number( id ), user_id );

    if( error ){
      res.json( {
        error: {
          message: "Type of question is 'single' and right possible answer already exists or type of question is 'free'",
          meta: "is_right"
        }
      } );

      return;
    }

    res.json( { payload: id_ } );
  } catch( error ) {
    console.error( `> \x1b[31mFailed to create possible answer for question\x1b[0m` );
    console.error( error );

    // #fix убрать error
    res.status( 503 ).json( {
      error: {
        message: "Failed to create possible answer for question",
        meta: { error, message: error.message }
      }
    } );
  }
}

async function get(
  {
    params: { id }
  }: ERequest,
  res: EResponse<PossibleAnswerReadDTO[]>
){
  try{
    const possibleAnswers = await possibleAnswerService.getByQuestionId( Number( id ) );

    res.json( { payload: possibleAnswers } );
  } catch( error ) {
    console.error( `> \x1b[31mFailed to get possible answers\x1b[0m` );
    console.error( error );

    // #fix убрать error
    res.status( 503 ).json( {
      error: {
        message: "Failed to get possible answers",
        meta: { error, message: error.message }
      }
    } );
  }
}

export {
  post,
  get
};