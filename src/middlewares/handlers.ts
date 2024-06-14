import { Request, Response } from "express";
import { Pool, QueryResult } from "pg";
import { queryPool, queryPoolFromProcedure } from "../databases/index.js";
import { hash } from "../utils/hash.js";
import { Session, SessionData } from "express-session";
import {
  RouteEvent,
  DBProcedure,
  DBProcedureArgsMappingType,
  DBProcedureResultsMappingType,
  RoutePath,
} from "../types";
import { UbiquitousConcept } from "../types.js";

function getEpochString(): string {
  return (Date.now() / 1000).toString();
}

function getDBprocedureArgs<T extends keyof DBProcedureArgsMappingType>(
  pro: T,
  route: Request["route"],
  params: Request["params"],
  bodyParams: Request["body"]["params"],
  session: SessionData,
  hash: (s: string) => string,
  extractEventFromRoute: (r:RoutePath) => RouteEvent, 
  merge: (u0: string, u1: string) => string,
  error?: Error
): DBProcedureArgsMappingType[DBProcedure] {
  switch (pro) {
    case "check_signin":
      return {
        userName: "string", 
        pwd: "string" 
      };

    case "check_signup":
      return   {
      userId: hash(bodyParams.userName),
      epoch: session.reqEpoch,
      userName: bodyParams.userName,
      pwd: hash(bodyParams.pwd)
    };

    case "see_watchers":
      return { artistId: session.artistId };

    case "see_more_users":
      return { artistId: session.artistId };

    case "see_works":
      return { artistId: session.artistId };

    case "see_more_liked_works":
      return { artistId: session.userId };

    case "see_watched_artists":
      return { userId: session.userId };

    case "see_more_artists":
      return { userId: session.userId };

    case "see_liked_works":
      return { userId: session.userId };

    case "see_more_liked_works":
      return { userId: session.userId };

    case "view_user":
      return { artistId: session.artistId, userId: params.userId};

    case "view_artist":
      return { artistId: params.artistId, userId: session.userId };

    case "view_works_of_artist":
      return { artistId: params.artistId, userId: session.userId };

    case "view_work":
      return { userId: "string", workId: "string" };

    case "ban_watcher":
      return { artistId: session.artistId, userId: "string" };

    case "submit_work":
      return { artistId: session.artistId, workName: "string" };

    case "submit_first_work":
      return { userId: session.userId, workName: "string" };

    case "withdraw_work":
      return { workId: "string" };

    case "watch_artist":
      return { userId: session.userId, artistId: params.artistId };

    case "rewatch_artist":
      return { userArtistId: "string" };

    case "unwatch_artist":
      return { userId: session.userId, artistId: params.artistId };

    case "go_view_work":
      return { userId: session.userId, workId: "string" };
    case "go_review_work":
      return { userWorkdId: "string" };

    case "like_work":
      return { userId: session.userId, workId: "string" };

    case "unlike_work":
      return { userId: session.userId, workId: "string" };

    case "signout":
      return {};

    case "delete_":
      return { 
        userId: session.userId, 
        epoch: session.reqEpoch};

    case "insert_into_requests_logs":
      return { 
        epoch : session.reqEpoch, 
        path: route.path,
        methods: route.methods
      };

    case "insert_into_responses_logs":
      return {
        epoch : session.reqEpoch,
        path: route.path,
        methods: route.methods
      };

    case "insert_into_errors_logs":
      return {
        epoch : session.reqEpoch,
        path: route.path,
        methods: route.methods,
        error: Error('error'),
      };

    case "select_full_logs":
      return {};

    default:
      return {};
  }
}

function updateRequestSession(
  session: SessionData,
  pro: DBProcedure,
  output: QueryResult<any>
): void {
  switch (pro) {
    case "check_signin":
      if (output.rows.length === 0) {
        if (output.rows[0]["artist_id"]) {
          Object.defineProperty(session, "userId", output.rows[0]["user_id"]);
          Object.defineProperty(
            session,
            "artistId",
            output.rows[0]["artist_id"]
          );
        } else {
          Object.defineProperty(session, "userId", output.rows[0]["user_id"]);
        }
      }
      break;
    case "check_signup":
      if (output.rows.length === 0) {
        Object.defineProperty(session, "userId", output.rows[0]["user_id"]);
      }
      break;
    case "delete_":
      delete session.userId;
      if (session.artistId) {
        delete session.artistId;
      }
      break;
    default: {
    }
  }
}

async function getDBprocedureOuputs<T extends DBProcedures>(
  pool: Pool,
  pro: T,
  args: DBProcedureArgsMappingType[T]
): Promise<Array<DBProcedureResultsMappingType[T]>> {
  const res = await queryPoolFromProcedure(
    pool,
    pro,
    args.map((k, v) => v[0])
  ).rows;
  return res;
}

function convertToCellProps(field: string, cell: any): CellProps {
  let props = { value: cell, link: undefined };
  if (field === "user_id") {
    Object.defineProperty(props, "link", `/profile/users/user?${cell}`);
  } else if (field === "artist_id") {
    Object.defineProperty(props, "link", `/profile/artists/artist?${cell}`);
  } else if (field === "work_id") {
    Object.defineProperty(props, "link", `/profile/works/work?${cell}`);
  } else if (field === "ban") {
    Object.defineProperty(props, "link", `/profile/users/user?${cell}/ban`);
  } else if (field === "withdraw") {
    Object.defineProperty(
      props,
      "link",
      `/profile/works/work?${cell}/withdraw`
    );
  } else if (field === "unlike") {
    Object.defineProperty(props, "link", `/profile/works/work?${cell}/unlike`);
  }
  return props;
}

const buildErrorHandler = function (
  req: Request,
  cb?: (err: Error) => void
): (err: Error) => void {
  function errorHandler(err: Error) {
    const no = getEpochString();
    if (req.session.reqEpoch && req.session.path) {
      const resQuery = queryPoolFromProcedure(pool, "insert_into_errors_logs", [
        req.session.reqEpoch,
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

async function fallbackToIndex(res: Response): Promise<void> {
  res.redirect("/");
}

async function fallbackToHome(res: Response): Promise<void> {
  res.redirect("/home");
}

export {
  getEpochString,
  checkAnswer,
  fallbackToIndex,
  fallbackToHome,
  buildErrorHandler,
};
