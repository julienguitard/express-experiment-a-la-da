import { Session, SessionData } from 'express-session';
import { Pool, QueryResult } from 'pg';


declare module 'express-session' {

    import {QueryResults} from "pg";
    import ProcedureOuput from "./types"
    declare interface SessionData {
      userId?: string,
      startTime?:string,
      reqTime?:string,
      userId?:string,
      userName?:string,
      artistId?:string,
      procedureOutput?:ProcedureOuput<QueryResult>,
      views?:number
    }
  }

export type {Session, SessionData};
