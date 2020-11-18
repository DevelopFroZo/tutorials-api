import type { Pool } from "pg";
import type * as core from "express-serve-static-core";
import type { Request, Response } from "express";

import type { Transaction } from "@u/db/clients";

export type Client = Pool | Transaction

export enum EntityNames {
  SECTIONS = "sections",
  COURSES = "courses",
  COURSES_SECTIONS = "courses_sections"
}

export enum Rights {
  CREATE = "1000",
  READ = "0100",
  UPDATE = "0010",
  DELETE = "0001"
}

export interface Session {
  user_id: number
}

export interface EError<T = any> {
  message: string,
  meta?: T,
  localeCode?: number
}

export type ERequest<ReqBody = any> = Request<core.ParamsDictionary, any, ReqBody, core.Query> & { session: Session }

export type EResponse<T = any, R = any> = Response<{
  payload?: T,
  error?: EError<R>
}>