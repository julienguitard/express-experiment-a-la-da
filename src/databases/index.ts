import dotenv_, { DotenvConfigOutput } from "dotenv";
import pg, { PoolConfig, Pool, QueryResult } from "pg";
import { DBProcedure, DBProcedureArgsMappingType } from "../types.js";
import errorConsoleLog from "../utils/errorConsoleLog.js";
import { convertToSql, processQueryPoolArgs, parseSQLOutput} from "./factory.js";

const dotenv: DotenvConfigOutput = dotenv_.config();
const poolConfig: PoolConfig = {
  database: process.env.DATABASE,
  user: "express_000", //TO DO
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: Number(process.env.PORT),
  ssl: false,
  max: 20, // set pool max size to 20
  idleTimeoutMillis: 1000, // close idle clients after 1 second
  connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
  maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
};

const pool: Pool = new pg.Pool(poolConfig);

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
  console.log('pro: '+pro);
  if (cb){
      return queryPoolFromProcedure_(po, pro,params, cb);
  }
  else {
    return queryPoolFromProcedure_(po, pro,params);
  }
}

export { pool, queryPool, queryPoolFromProcedure };
