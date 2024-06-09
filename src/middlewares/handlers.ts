import { Request, Response } from "express";
import { Pool, QueryResult } from "pg";
import { queryPool, queryPoolFromProcedure } from "../databases/index.js";
import { hash } from "../utils/hash.js";
import { Session, SessionData } from "express-session";
import {
  DBProcedures,
  DBProcedureArgsMappingType,
  DBProcedureResultsMappingType,
} from "../types";
import { UbiquitousConcept, CellProps } from "../types.js";

function getDBprocedureArgs<T extends DBProcedures>(
  pro: T,
  route: Request["route"],
  session: SessionData,
  params: Request["params"],
  bodyParams: Request["body"]["params"],
  hash: (s: string) => string,
  merge: (u0: string, u1: string) => string,
  error?: Error
): DBProcedureArgsMappingType[T] {
  switch (pro) {
    case "insert_user_event":
      return [
        { userId: session.userId },
        { time: session.reqTime },
        { key: "create" },
      ];
      break;
    case "insert_artist":
      return [
        { artistId: session.artistId },
        { time: session.reqTime },
        { userId: session.userId },
      ];
      break;
    case "insert_artist_event":
      return [
        { artistId: session.artistId },
        { time: session.reqTime },
        { key: "create" },
      ];
      break;
    case "insert_work":
      return [
        { workId: params.workId },
        { artistId: session.artistId },
        { time: session.reqTime },
        { workName: bodyParams.workName },
      ];
      break;
    case "insert_user":
      return [
        { userId: session.userId },
        { time: session.reqTime },
        { userName: session.userName },
        { pwd: hash(bodyParams.pwd) },
      ];
      break;
    case "insert_work_event":
      return [
        { workId: params.workId },
        { time: session.reqTime },
        { key: "create" },
      ];
      break;
    case "insert_user_artist":
      if (session.userId) {
        return [
          { userArtistId: merge(session.userId, params.artistId) },
          { userId: session.userId },
          { artistId: session.artistId },
          { time: session.reqTime },
        ];
      } else {
        throw "Missing userId";
      }
      break;
    case "insert_user_artist_event":
      if (session.userId) {
        return [
          { userArtistId: merge(session.userId, params.artistId) },
          { time: session.reqTime },
          { key: "create" },
        ];
      } else {
        throw "Missing userId";
      }
      break;
    case "insert_user_work":
      if (session.userId) {
        return [
          { userWorkId: merge(session.userId, params.workId) },
          { userId: session.userId },
          { workId: params.workId },
          { time: session.reqTime },
        ];
      } else {
        throw "Missing userId";
      }
      break;
    case "insert_user_work_event":
      if (session.userId) {
        return [
          { userWorkId: merge(session.userId, params.workId) },
          { time: session.reqTime },
          { key: "create" },
        ];
      } else {
        throw "Missing userId";
      }
      break;
    case "check_signin":
      return [{ userName: session.userName }, { pwd: hash(bodyParams.pwd) }];
      break;
    case "check_signup":
      return [
        { userName: session.userName },
        { pwd: hash(bodyParams.pwd) },
        { confirmedPwd: hash(bodyParams.confirmedPwd) },
      ];
      break;
    case "see_my_watchers":
      return [{ artistId: session.artistId }];
      break;
    case "see_more_users":
      return [{ artistId: session.artistId }];
      break;
    case "see_my_works":
      return [{ artistId: session.artistId }];
      break;
    case "see_more_of_my_works":
      return [{ artistId: session.artistId }];
      break;
    case "see_my_watched_artists":
      return [{ userId: session.userId }];
      break;
    case "see_more_artists":
      return [{ userId: session.userId }];
      break;
    case "see_my_liked_works":
      return [{ userId: session.userId }];
      break;
    case "see_more_works":
      return [{ userId: session.userId }];
      break;
    case "view_user":
      return [{ artistId: session.artistId }, { userId: session.userId }];
      break;
    case "view_artist":
      return [{ artistId: session.artistId }, { userId: session.userId }];
      break;
    case "view_works_of_artists":
      return [{ artistId: session.artistId }, { userId: session.userId }];
      break;
    case "view_work":
      return [{ userId: session.userId }, { workId: params.workId }];
      break;
    case "ban_watcher":
      return [{ artistId: session.artistId }, { userId: session.userId }];
      break;
    case "submit_work":
      return [
        { artistId: session.artistId },
        { workName: bodyParams.workName },
      ];
      break;
    case "withdraw_work":
      return [{ artistId: session.artistId }, { workId: params.workId }];
      break;
    case "submit_first_work":
      return [{ userId: session.userId }, { workName: bodyParams.workName }];
      break;
    case "watch_artist":
      return [{ userId: session.userId }, { artistId: session.artistId }];
      break;
    case "unwatch_artist":
      return [{ userId: session.userId }, { artistId: session.artistId }];
      break;
    case "like_work":
      return [{ userId: session.userId }, { workId: params.workId }];
      break;
    case "unlike_work":
      return [{ userId: session.userId }, { workId: params.workId }];
      break;
    case "insert_into_requests_logs":
      return [
        { time: session.reqTime },
        { path: route.path },
        { methods: route.methods },
      ];
      break;
    case "insert_into_responses_logs":
      return [
        { time: session.reqTime },
        { path: session.path },
        { methods: route.methods },
        { error: error },
      ];
      break;
    case "insert_into_errors_logs":
      return [
        { time: session.reqTime },
        { path: session.path },
        { methods: route.methods },
        { error: error },
      ];
      break;
    case "select_full_logs":
      return [];
      break;
  }
}

async function getDBprocedureOuputs<T extends DBProcedures>(
  pool:Pool,
  pro : T,
  args : DBProcedureArgsMappingType[T]
) : Promise<Array<DBProcedureResultsMappingType[T]>>
{
  const res = await queryPoolFromProcedure(pool,pro,args.map((k,v)=>v[0])).rows;
  return res;
}

function getTitle(): string {
  return "Jus page";
}

function getHeader(): Header {
  return { title: getTitle() };
}

function getTime(): string {
  return (Date.now() / 1000).toString();
}

function getSigninAs(session: SessionData): string {
  return session.userId || "none";
}

function getStartTime(session: SessionData): string {
  return session.startTime || getTime();
}



//function getFormProps(formType:string):Form{
//
//}

function getUserId(
  route: Request["route"],
  session: SessionData,
  params: Request["params"]
): string {
  if (":artistId" in route.split("/")) {
    return params.userId;
  } else if (session.userId) {
    return session.userId;
  } else if (params.userName && params.pwd) {
    return hash(params.userName);
  } else {
    throw Error("Unmatched case");
  }
}

function getUserName(params: Request["params"]): string {
  if (params.userName && params.pwd) {
    return params.userName;
  } else {
    throw Error("Unmatched case");
  }
}

function getPwd(params: Request["params"]): string {
  if (params.userName && params.pwd) {
    return hash(params.pwd);
  } else {
    throw Error("Unmatched case");
  }
}

function getKey(route: Request["route"]): string {
  //TO DO
  if ("delete" in route.split("/")) {
    return "delete";
  } else if ("watch" in route.split("/")) {
    return "watch";
  } else if ("signup" in route.split("/")) {
    return "create";
  } else if ("submit" in route.split("/")) {
    return "submit";
  } else if ("like" in route.split("/")) {
    return "like";
  } else {
    return "create";
  }
}

function getArtistId(
  route: Request["route"],
  session: SessionData,
  params: Request["params"]
): string {
  if (":artistId" in route.split("/")) {
    return params.artistId;
  } else if (session.artistId) {
    return session.artistId;
  } else if (session.userId) {
    return hash(session.userId);
  } else {
    throw Error("Unmatched case");
  }
}

function getWorkId(route: Request["route"], params: Request["params"]): string {
  if (":workId" in route.split("/")) {
    return params.workId;
  } else {
    throw Error("Unmatched case");
  }
}

function getUserArtistId(
  route: Request["route"],
  session: SessionData,
  params: Request["params"]
): string {
  if (":artistId" in route.split("/") && session.userId) {
    return hash(params.artistId + session.userId);
  } else {
    throw Error("Unmatched case");
  }
}

function getUserWorkId(
  route: Request["route"],
  session: SessionData,
  params: Request["params"]
): string {
  if (":workId" in route.split("/") && session.userId) {
    return hash(params.workId + session.userId);
  } else {
    throw Error("Unmatched case");
  }
}

function requestParamsHandler(
  route: Request["route"],
  session: SessionData,
  params: Request["params"]
): Record<string, any> {
  return {
    userId: getUserId(route, session, params),
    time: getTime(),
    userName: getUserName(params),
    pwd: getPwd(params),
    key: getKey(route),
    artistId: getArtistId(route, session, params),
    workId: getWorkId(route, params),
    userArtistId: getUserArtistId(route, session, params),
    workArtistId: getUserWorkId(route, session, params),
  };
}

function dbHandlerBuilder(
  pool: Pool,
  proc: string,
  procArgs: Array<string>
): (params: Record<string, any>) => Promise<QueryResult<any>> {
  function dbHandler(params: Record<string, any>): Promise<QueryResult<any>> {
    return queryPool(
      pool,
      "SELECT * FROM " + proc,
      procArgs.map((a) => params[a])
    );
  }
  return dbHandler;
}

function outputCallbackBuilder(route: string, url?: string): any {
  if ("api" in route.split("/")) {
    return (res: Response, props: Object) => {
      res.json(props);
    };
  } else if (route) {
    return (res: Response, props: Object) => {
      res.render("index.js", props);
    };
  } else if (url) {
    return (res: Response, props: Object) => {
      res.redirect(url);
    };
  } else {
    throw Error("Unmatched case");
  }
}

function convertToCellProps(field: string, cell: any): CellProps {
  let props = { value: cell, link: undefined };
  if (field === "user_id") {
    Object.defineProperty(
      props,
      "link",
      `//profile/users/user?${cell}`
    );
  } else if (field === "artist_id") {
    Object.defineProperty(
      props,
      "link",
      `//profile/artists/artist?${cell}`
    );
  } else if (field === "work_id") {
    Object.defineProperty(
      props,
      "link",
      `//profile/works/work?${cell}`
    );
  } else if (field === "ban") {
    Object.defineProperty(
      props,
      "link",
      `//profile/users/user?${cell}/ban`
    );
  } else if (field === "withdraw") {
    Object.defineProperty(
      props,
      "link",
      `//profile/works/work?${cell}/withdraw`
    );
  } else if (field === "unlike") {
    Object.defineProperty(
      props,
      "link",
      `//profile/works/work?${cell}/unlike`
    );
  }
  return props;
}


const buildErrorHandler = function (
  req: Request,
  cb?: (err: Error) => void
): (err: Error) => void {
  function errorHandler(err: Error) {
    const no = getTime();
    if (req.session.reqTime && req.session.path) {
      const resQuery = queryPoolFromProcedure(pool, "insert_into_errors_logs", [
        req.session.reqTime,
        no,
        req.session.path,
        err.message,
      ]);
      if (cb){
        cb(err);
      }
    }
  }
  return errorHandler;
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
    res.redirect("/home");
  } else {
    throw Error("Failed identification");
  }
}

async function fallbackToIndex(
  res: Response,
): Promise<void> {
  res.redirect("/");
}

async function fallbackToHome(
  res: Response,
): Promise<void> {
  res.redirect("/home");
}

export { getTime, checkAnswer, fallbackToIndex, fallbackToHome, buildErrorHandler };
