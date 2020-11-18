import type { NextFunction } from "express";

import type { ERequest, Session } from "@t";

function defaultSession( req: ERequest, {}, next: NextFunction ): void{
  const session: Session = {
    user_id: 1
  };

  const entries = Object.entries( session );

  for( const [ key, value ] of entries ){
    if( !( key in req.session ) ){
      req.session[ key ] = value;
    }
  }

  next();
}

export { defaultSession };