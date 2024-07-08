import dotenv_, { DotenvConfigOutput } from "dotenv";
import {Pool, QueryResult } from "pg";
import { DBProcedure, DBProcedureArgsMappingType } from "../types.js";
import { convertToSql, processQueryPoolArgs, parseSQLOutput} from "./factory.js";
import { pool} from "./pool";

async function queryPool(
  po: Pool,
  sql: string,
  params: Array<string>,
  cb?:(ou:QueryResult<any>)=>any
): Promise<QueryResult<any>> {
  const res = po.query(sql, params);
  if (cb){
    return res.then((ou)=>cb(ou));
  }
  else {
    return res;
  }
}

async function queryPoolFromProcedure_(
  po: Pool,
  pro: DBProcedure,
  params: Array<string>,
  cb?:(ou:QueryResult<any>)=>any
): Promise<QueryResult<any>> {
  const sql = convertToSql(pro, params);
  if (cb){
    return queryPool(po, sql, params, cb);
  }
  else {
    return queryPool(po, sql, params);
  }
}
async function queryPoolFromProcedure<T extends keyof DBProcedureArgsMappingType>(
  po: Pool,
  pro: T,
  args: DBProcedureArgsMappingType[T],
  cb?:(ou:QueryResult<any>)=>any
): Promise<QueryResult<any>> {
  const params = processQueryPoolArgs(args);
  if (cb){
      return queryPoolFromProcedure_(po, pro,params, cb);
  }
  else {
    return queryPoolFromProcedure_(po, pro,params);
  }
}
export {pool, queryPool, queryPoolFromProcedure };
