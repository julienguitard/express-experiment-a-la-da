import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import { QueryResult } from "pg";
import { Session, SessionData } from "../express-session";
import { pool, queryPool, queryPoolFromProcedure } from "../databases/index.js";
import { hash } from "../utils/hash";
import { UbiquitousConcept } from "../types";
import {
  getTime,
  checkAnswer,
  fallbackToIndex,
  fallbackToHome,
  buildErrorHandler,
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

function updateSessionInitially(session: SessionData, req: Request): void {
  session.reqTime = getTime();
  session.startTime = session.startTime ?? getTime();
  session.userId = session.userId ?? "Admin";
  session.userName = session.userName ?? "Admin";
  session.artistId = session.artistId ?? "Admin";
  session.views = (session.views ?? 0) + 1;

  if (req.route) {
    session.path = req.route.path;
  } else {
    session.path = "Unknown route";
  }
}

const sessionFirstUpdateControler = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session) {
    updateSessionInitially(req.session, req);
    console.log(req.session);
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
  const reqData = queryPoolFromProcedure(pool, "insert_into_requests_logs", [
    req.session.reqTime,
    req.session.path,
    meths,
  ]);
  const nextVoid = reqData.then((r) => {
    next();
  });
  const resData = nextVoid.then(() => {
    let no = getTime();
    return queryPoolFromProcedure(pool, "insert_into_responses_logs", [
      req.session.reqTime ?? "",
      no,
      req.session.path ?? "unknown route path",
      res.statusCode.toString(),
    ]);
  });
};

const showLogsControler = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const resData = queryPoolFromProcedure(pool, "select_full_logs", []).then(
    (data) => {
      console.log(data.fields, data.rows);
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
      console.log(parseSQLOutput(data));
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


const signinSubmitControler = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const sqlOutput = queryPoolFromProcedure(pool, "check_signin", [
    req.body.userName,
    hash(req.body.pwd),
  ])
    .then((data) => checkAnswer(req, res, data))
    .catch((err) => fallbackToIndex(req, res, err))
    .finally(next);
};

async function checkConfirmedPwd(req: Request): Promise<Request> {
  if (req.body.pwd === req.body.confirmedPwd) {
    return req;
  } else {
    throw "Unmacthing password";
  }
}

const signupSubmitControler = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  checkConfirmedPwd(req)
    .then((req) =>
      queryPoolFromProcedure(pool, "insert_user", [
        hash(req.body.userName),
        getTime(),
        req.body.userName,
        hash(req.body.pwd),
      ])
    )
    .then((data) => checkAnswer(req, res, data))
    .catch((err) => fallbackToIndex(req, res, err))
    .finally(next);
};

async function getReqData(
  req: Request
): Promise<Record<UbiquitousConcept, string>> {
  const reqData = {};
  if (req.session.startTime) {
    Object.defineProperty(reqData, "startTime", req.session.startTime);
  }
  if (req.session.userId) {
    Object.defineProperty(reqData, "userId", req.session.userId);
  }
  if (req.session.userName) {
    Object.defineProperty(reqData, "userName", req.session.userName);
  }
  if (req.session.artistId) {
    Object.defineProperty(reqData, "artistId", req.session.artistId);
  }
  return reqData;
}

const getHomeControler = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  getReqData(req)
    .then((reqData) => {
      return {
        startTime: reqData.startTime,
        userName: reqData.userName,
        artistId: reqData.artistId,
        myWatchers:
          reqData.artistId === undefined
            ? undefined
            : queryPoolFromProcedure(pool, "see_my_watchers", [
                reqData.artistId,
              ]),
        myWorks:
          reqData.artistId === undefined
            ? undefined
            : queryPoolFromProcedure(pool, "see_my_works", [reqData.artistId]),
        myWatchedArtists: queryPoolFromProcedure(
          pool,
          "see_my_watched_artists",
          req.session.userId ? [req.session.userId] : undefined
        ),
        myLikedWorks: queryPoolFromProcedure(
          pool,
          "see_my_liked_works",
          req.session.userId ? [req.session.userId] : undefined
        ),
      };
    })
    .then((ou) =>
      ou.artistId === undefined
        ? res.render("./UserHome", ou)
        : res.render("./ArtistHome", ou)
    )
    .catch((err) => fallbackToIndex(req, res, err))
    .finally(next);
};

const banControler = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  getReqData(req)
    .then((reqData) =>
      queryPoolFromProcedure(pool, "ban_watcher", [
        reqData.artistId,
        req.params.userId,
      ])
    )
    .then((ou) => res.redirect(req.route.path))
    .catch((err) => fallbackToHome(req, res, err))
    .finally(next);
};

const submitControler = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  getReqData(req)
    .then((reqData) =>
      queryPoolFromProcedure(pool, "submit_work", [
        reqData.artistId,
        req.params.workName,
      ])
    )
    .then((ou) => res.redirect(req.route.path))
    .catch((err) => fallbackToHome(req, res, err))
    .finally(next);
};

const withdrawControler = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  getReqData(req)
    .then((reqData) =>
      queryPoolFromProcedure(pool, "withdraw_work", [
        reqData.artistId,
        req.params.workId,
      ])
    )
    .then((ou) => res.redirect(req.route.path))
    .catch((err) => fallbackToHome(req, res, err))
    .finally(next);
};

const watchControler = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  getReqData(req)
    .then((reqData) =>
      queryPoolFromProcedure(pool, "watch_artist", [
        reqData.userId,
        req.params.artistId,
      ])
    )
    .then((ou) => res.redirect(req.route.path))
    .catch((err) => fallbackToHome(req, res, err))
    .finally(next);
};

const unwatchControler = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  getReqData(req)
    .then((reqData) =>
      queryPoolFromProcedure(pool, "unwatch_artist", [
        reqData.userId,
        req.params.artistId,
      ])
    )
    .then((ou) => res.redirect(req.route.path))
    .catch((err) => fallbackToHome(req, res, err))
    .finally(next);
};

const likeControler = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  getReqData(req)
    .then((reqData) =>
      queryPoolFromProcedure(pool, "like_work", [
        reqData.userId,
        req.params.workId,
      ])
    )
    .then((ou) => res.redirect(req.route.path))
    .catch((err) => fallbackToHome(req, res, err))
    .finally(next);
};
const unlikeControler = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  getReqData(req)
    .then((reqData) =>
      queryPoolFromProcedure(pool, "unlike_work", [
        reqData.userId,
        req.params.workId,
      ])
    )
    .then((ou) => res.redirect(req.route.path))
    .catch((err) => fallbackToHome(req, res, err))
    .finally(next);
};


export {
  sessionFirstUpdateControler,
  consoleControler,
  logToPostgresControler,
  showLogsControler,
  showLogsTableControler,
  pageNotFoundControler,
  signinSubmitControler,
  signupSubmitControler,
};
