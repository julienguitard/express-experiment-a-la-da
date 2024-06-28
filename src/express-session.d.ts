import { Session, SessionData } from 'express-session';
import { Pool, QueryResult } from 'pg';


declare module 'express-session' {

    import {QueryResults} from "pg";
    import ProcedureOuput from "./types"

    declare interface SessionData {
      startTime?:string,
      reqEpoch?:string,
      path?:string,
      userId?:string,
      userName?:string,
      artistId?:string,
      procedureOutput?:ProcedureOuput<QueryResult>,
      views?:number,
      params?:any
    }

    declare type SessionLevel = 'NotSignedin'| 'SignedinAsUser'|'SignedinAsArtist';
 
}

export type {Session,  SessionData, SessionLevel};
