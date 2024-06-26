import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import { QueryResult } from "pg";
import { Session, SessionData } from "../express-session";
import { pool, queryPool, queryPoolFromProcedure } from "../databases/index.js";
import { hash } from "../utils/hash";
import { UbiquitousConcept } from "../types";
import {
  getEpochString,
  updateSessionInitially,
  buildErrorHandler,
  getDBprocedureArgs,
} from "./handlers";
import { parseSQLOutput } from "../databases/factory";


const consoleControler = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(
    Object.entries(req.route.methods)
      .filter(([k, v]) => v)
      .map(([k, v]) => k) +
      " " +
      req.route.path
  );
  next();
};

const sessionFirstUpdateControler = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session) {
    updateSessionInitially(req.session, req);
  } else {
    throw Error("Session not initialized");
  }
  next();
};

const clockControler = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const data_ = queryPool(pool, "SELECT NOW() AS time_, $1 AS check_,", []);
  data_
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(50).send(err));
};

const logToPostgresControler = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const meths = Object.entries(req.route.methods)
    .filter(([k, v]) => v)
    .map(([k, v]) => k)
    .join(",");
  let args = getDBprocedureArgs(req,"insert_into_requests_logs",hash)
  const reqData = queryPoolFromProcedure(pool, "insert_into_requests_logs",args);
  const nextVoid = reqData.then((r) => {
    next();
  });
  const resData = nextVoid.then(() => {
    let args = getDBprocedureArgs(req,"insert_into_responses_logs",hash)
    return queryPoolFromProcedure(pool, "insert_into_responses_logs", args);
  });
};

const showLogsControler = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const resData = queryPoolFromProcedure(pool, "select_full_logs", []).then(
    (data) => {
      res.json({ data: parseSQLOutput(data) });
    }
  );
};

const showLogsTableControler = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const resData = queryPoolFromProcedure(pool, "select_full_logs", []).then(
    (data) => {
      const props = {
        footer: { views: req.session.views, userName: "self" },
        data: parseSQLOutput(data),
      };
      res.render("tableIndex.ejs", props);
    }
  );
};

const pageNotFoundControler = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log('Oh no !!!!!')
  next(createError(404));
};

export {
  sessionFirstUpdateControler,
  consoleControler,
  logToPostgresControler,
  showLogsControler,
  showLogsTableControler,
  pageNotFoundControler
};
