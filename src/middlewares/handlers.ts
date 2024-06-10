import { Request, Response } from "express";
import { Pool, QueryResult } from "pg";
import { queryPool, queryPoolFromProcedure } from "../databases/index.js";
import { hash } from "../utils/hash.js";
import { Session, SessionData } from "express-session";
import {
  DBProcedure,
  DBProcedureArgsMappingType,
  DBProcedureResultsMappingType,
  RoutePath,
} from "../types";
import { UbiquitousConcept } from "../types.js";


const RouteDBProcedureDict: Record<RoutePath, DBProcedure | Record<string, DBProcedure>> = {
  "/": {},
  "/landing/signin": {},
  "/landing/signup": {},
  "/landing/signin/submit": 'check_signin',
  "/landing/signup/submit": 'check_signup',
  "/home": {
    see_my_watchers: 'see_my_watchers',
    see_my_works: 'see_my_works',
    see_my_watched_artists: 'see_my_watched_artists',
    see_my_liked_works: 'see_my_watched_artists',
  },
  "/home/works/firstSubmit": {},
  "/home/works/firstSubmit/submit": 'submit_my_first_work',
  "/home/works/submit": {},
  "/home/works/submit/submit": 'submit_work',
  "/home/users/more": 'see_more_users',
  "/home/artists/more": 'see_more_artists',
  "/home/works/more": 'see_more_works',
  "/profile/users/user/:userId": 'view_user',
  "/profile/artists/artist/:artistId": {
    view_artist: 'view_artist',
    view_works_of_artist: 'view_works_of_artist'
  },
  "/profile/works/work/:workId": 'view_work',
  "/profile/users/user/:userWorkId/ban": {},
  "/profile/users/user/:userWorkId/ban/submit": 'ban_watcher',
  "/profile/artists/artist/:artistId/watch": 'watch_artist',
  "/profile/artists/artist/:userArtistId/watch": 'watch_artist',
  "/profile/artists/artist/:userArtistId/unwatch": 'unwatch_artist',
  "/profile/works/work/:workId/like": 'like_work',
  "/profile/works/work/:userWorkId/like": 'like_work',
  "/profile/works/work/:userWorkId/unlike": 'like_work',
  "/signout": {},
  "/signout/submit": 'signout',
  "/delete": {},
  "/delete/submit": 'delete'

}

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
    case "insert_user":
      return [
        { userId: session.userId },
        { time: session.reqTime },
        { userName: session.userName },
        { pwd: hash(bodyParams.pwd) },
      ];
      break;
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
          { userArtistId: hash(merge(session.userId, params.artistId)) },
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
          { userArtistId: hash(merge(session.userId, params.artistId)) },
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
          { userWorkId: hash(merge(session.userId, params.workId)) },
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
          { userWorkId: hash(merge(session.userId, params.workId)) },
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

console.log()

async function getDBprocedureOuputs<T extends DBProcedures>(
  pool: Pool,
  pro: T,
  args: DBProcedureArgsMappingType[T]
): Promise<Array<DBProcedureResultsMappingType[T]>> {
  const res = await queryPoolFromProcedure(pool, pro, args.map((k, v) => v[0])).rows;
  return res;
}


function getEpochString(): string {
  return (Date.now() / 1000).toString();
}

function convertToCellProps(field: string, cell: any): CellProps {
  let props = { value: cell, link: undefined };
  if (field === "user_id") {
    Object.defineProperty(
      props,
      "link",
      `/profile/users/user?${cell}`
    );
  } else if (field === "artist_id") {
    Object.defineProperty(
      props,
      "link",
      `/profile/artists/artist?${cell}`
    );
  } else if (field === "work_id") {
    Object.defineProperty(
      props,
      "link",
      `/profile/works/work?${cell}`
    );
  } else if (field === "ban") {
    Object.defineProperty(
      props,
      "link",
      `/profile/users/user?${cell}/ban`
    );
  } else if (field === "withdraw") {
    Object.defineProperty(
      props,
      "link",
      `/profile/works/work?${cell}/withdraw`
    );
  } else if (field === "unlike") {
    Object.defineProperty(
      props,
      "link",
      `/profile/works/work?${cell}/unlike`
    );
  }
  return props;
}


const buildErrorHandler = function (
  req: Request,
  cb?: (err: Error) => void
): (err: Error) => void {
  function errorHandler(err: Error) {
    const no = getEpochString();
    if (req.session.reqTime && req.session.path) {
      const resQuery = queryPoolFromProcedure(pool, "insert_into_errors_logs", [
        req.session.reqTime,
        no,
        req.session.path,
        err.message,
      ]);
      if (cb) {
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

export { getEpochString, checkAnswer, fallbackToIndex, fallbackToHome, buildErrorHandler };
