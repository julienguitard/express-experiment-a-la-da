import { Request, Response, NextFunction } from "express";
import { QueryResult } from "pg";
import { Session, SessionData } from "../express-session";
import { pool, queryPool, queryPoolFromProcedure } from "../databases/index.js";
import { procedures } from "../databases/procedures.js";
import { getTime, parseSQLOutput } from "./handlers.js";
import { hash } from "../utils/hash";
import { rawListeners } from "process";
import { FlowingConcept } from "../types";

const getIndexProps = (session: SessionData) => {
  return {
    header: {
      title: "Jus sandbox",
    },
    footer: {
      signedinAs: session.userId || "none",
      startTime: session.startTime || getTime(),
    },
  };
};

const renderControler = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("renderControler");
  try {
    //res.render('index', {footer:{ views: req.session.views, userName: 'self' }});

    const indexProps = {
      header: {
        title: "Jus sandbox",
      },
      footer: {
        signedinAs: "Ju",
        startTime: "2024-05-20 00:00:00",
      },
    };
    res.render("LegacyIndex", { indexProps: indexProps });
  } catch (e) {
    console.log(e);
  } finally {
    next();
  }
};

const dataControler = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.send(res.json);
  } catch (e) {
    console.log(e);
  } finally {
    next();
  }
};

const viewControler = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("viewControler");
  if (req.session) {
    if (!("views" in Object.keys(req.session))) {
      req.session.views = 0;
    } else {
      req.session.views = req.session.views + 1;
    }
  } else {
    //TO DO
    throw Error("Session not initialized");
  }
  next();
};

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
  const now_ = getTime();
  const reqData = queryPoolFromProcedure(pool, "insert_into_requests_logs", [
    now_,
    req.route.path,
    meths,
  ]);
  const nextVoid = reqData.then((r) => {
    next();
  });
  const errVoid = nextVoid.catch((err) => {
    let no = getTime();
    return queryPoolFromProcedure(pool, "insert_into_errors_logs", [
      now_,
      no,
      req.route.path,
      err,
    ]);
  });
  const resData = errVoid.finally(() => {
    let no = getTime();
    return queryPoolFromProcedure(pool, "insert_into_responses_logs", [
      now_,
      no,
      req.route.path,
      res.statusCode,
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

const mockSessionControler = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  req.session.userName = "Ju";
  req.session.startTime = "2024-04-23 09:07:12";
  next();
};

const pageNotFoundControler = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  next(Error("404"));
};

const mockErrorControler = function (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.render("./static/Error");
};

const errorControler = function (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.render("Error", { error: err });
  next();
};

async function checkAnswer(
  req: Request,
  res: Response,
  data: QueryResult<any>
): Promise<void> {
  if (data.rows.length === 1) {
    req.session.userId = data.rows[0].userId;
    req.session.userName = data.rows[0].userName;
    req.session.artistId =
      data.rows[0].artistId === "undefined" ? undefined : data.rows[0].artistId;
    res.redirect("/parametrized/home");
  } else {
    throw Error("Failed identification");
  }
}

async function fallbackToIndex(
  req: Request,
  res: Response,
  err: Error
): Promise<void> {
  res.redirect("/parametrized");
}

async function fallbackToHome(
  req: Request,
  res: Response,
  err: Error
): Promise<void> {
  res.redirect("/parametrized/home");
}

const signinSubmitControler = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const sqlOutput = queryPoolFromProcedure(pool, "check_signin_from_req", [
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
      queryPoolFromProcedure(pool, "insert_user_event_from_req", [
        req.body.userName,
        hash(req.body.pwd),
        "create",
      ])
    )
    .then((data) => checkAnswer(req, res, data))
    .catch((err) => fallbackToIndex(req, res, err))
    .finally(next);
};

async function getReqData(
  req: Request
): Promise<Record<FlowingConcept, string | undefined>> {
  return {
    startTime: req.session.startTime,
    userId: req.session.userId,
    userName: req.session.userName,
    artistId: req.session.artistId,
  };
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
        myWatchers:
          reqData.artistId === undefined
            ? undefined
            : queryPoolFromProcedure(pool, "see_my_watchers_from_req", [
                req.session.artistId,
              ]),
        myWorks:
          reqData.artistId === undefined
            ? undefined
            : queryPoolFromProcedure(pool, "see_my_works_from_req", [
                req.session.artistId,
              ]),
        myWatchedArtists: queryPoolFromProcedure(
          pool,
          "see_my_watched_artists_from_req",
          [req.session.userId]
        ),
        myLikedWorks: queryPoolFromProcedure(
          pool,
          "see_my_liked_works_from_req",
          [req.session.userId]
        ),
      };
    })
    .then((ou) =>
      reqData.artistId === undefined
        ? res.render("./parametrized/UserHome", ou)
        : res.render("./parametrized/ArtistHome", ou)
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
  renderControler,
  viewControler,
  consoleControler,
  logToPostgresControler,
  showLogsControler,
  showLogsTableControler,
  mockSessionControler,
  pageNotFoundControler,
  errorControler,
  mockErrorControler,
  signinSubmitControler,
  signupSubmitControler,
};
