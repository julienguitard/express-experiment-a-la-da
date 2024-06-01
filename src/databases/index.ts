
import dotenv_, { DotenvConfigOutput } from 'dotenv';
import pg, { PoolConfig, Pool, QueryResult } from 'pg';
import { DBProcedure } from '../types.js';
import errorConsoleLog from '../utils/errorConsoleLog.js';
import { convertToSql } from './factory.js';

const dotenv: DotenvConfigOutput = dotenv_.config();
const poolConfig: PoolConfig = {
  database: process.env.DATABASE,
  user: 'express_000',//TO DO
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

async function queryPool(po: Pool, sql: string, params: Array<string>|undefined): Promise<QueryResult<any>|undefined> {
  
  let res = undefined;
  if (params){
    res = await po.query(sql, params);
  }
  console.log(res);
  return res;
}

async function queryPoolFromProcedure(po: Pool, pro: DBProcedure, params: Array<string>|undefined): Promise<QueryResult<any>|undefined> {
  const sql = convertToSql(pro,params);
  return queryPool(po, sql, params);
}

export { pool, queryPool, queryPoolFromProcedure};