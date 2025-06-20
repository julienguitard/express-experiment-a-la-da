import dotenv_, { DotenvConfigOutput } from "dotenv";
import pg, { PoolConfig, Pool, QueryResult } from "pg";


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

export {pool};