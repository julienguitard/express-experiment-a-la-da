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
  CellProps
} from "../types";

function getEpochString(): string {
  return (Date.now() / 1000).toString();
}

function getDBprocedureArgs<T extends keyof DBProcedureArgsMappingType>(
  req: Request,
  pro: T,
  hash: (s: string) => string,
  error?: Error
): DBProcedureArgsMappingType[DBProcedure] {
  console.log('get args');
  switch (pro) {
    case "check_signin":
      return {
        userName: req.body.userName, 
        pwd: hash(req.body.pwd)
      };

    case "check_signup":
      return   {
      userId: hash(req.body.userName),
      reqEpoch: req.session.reqEpoch,
      userName: req.body.userName,
      pwd: hash(req.body.pwd),
      confirmedPwd: hash(req.body.confirmedPwd)
    };

    case "see_watchers":
      return { 
        artistId: req.session.artistId
      };
    
    case "see_works":
        return {
          artistId: req.session.artistId
        };

    case "see_watched_artists":
      return { 
        userId: req.session.userId
       };

    case "see_liked_works":
        return {
          userId: req.session.userId
        };

    case "submit_first_work":
      let artistId = hash('artist' + req.session.userId);
      let workId = hash(artistId + req.body.workName);
      return { 
        workId: workId, 
        artistId: artistId,
        userId: req.session.userId,
        reqEpoch:req.session.reqEpoch,
        workName: req.body.workName };

    case "submit_work":
      return { 
        workId: hash(req.session.artistId + req.body.workName), 
        artistId: req.session.artistId,
        reqEpoch:req.session.reqEpoch,
        workName: req.body.workName };
  
    case "withdraw_work":
      return { 
        workId: req.params.workId, 
        reqEpoch:req.session.reqEpoch };
  
    case "see_more_users"://TO DO
      return { artistId: req.session.artistId };

    case "see_more_liked_works"://TO DO
      return { artistId: req.session.userId };

    case "see_more_artists"://TO DO
      return { userId: req.session.userId };

    case "see_more_liked_works"://TO DO
      return { userId: req.session.userId };

    case "view_user"://TO DO
      return { artistId: req.session.artistId, userId: req.params.userId};

    case "view_artist"://TO DO
      return { artistId: req.params.artistId, userId: req.session.userId };

    case "view_works_of_artist"://TO DO
      return { artistId: req.params.artistId, userId: req.session.userId };

    case "view_work"://TO DO
      return { userId: "string", workId: "string" };

    case "ban_watcher":
      return { 
        userArtistId: req.params.userArtistId,
        reqEpoch:req.session.reqEpoch 
      };

    case "watch_artist":
      return { 
        userArtistId: hash(req.session.userId + req.params.artistId),
        userId: req.session.userId, 
        artistId: req.params.artistId,
        reqEpoch : req.session.reqEpoch 
      };

    case "rewatch_artist":
      return { 
        userArtistId: req.params.userArtistId,
        reqEpoch:req.session.reqEpoch 
      };

    case "unwatch_artist":
      return { 
        userArtistId: req.params.userArtistId,
        reqEpoch:req.session.reqEpoch 
      };

    case "go_view_work"://TO DO
      return { userId: req.session.userId, workId: "string" };
    case "go_review_work"://TO DO
      return { userWorkIdId: "string" };

    case "like_work":
      return { 
        userWorkId: req.params.userWorkId,
        reqEpoch:req.session.reqEpoch 
      };

    case "unlike_work":
      return { 
        userWorkId: req.params.userWorkId,
        reqEpoch:req.session.reqEpoch 
      };

    case "delete_":
      return { 
        userId: req.session.userId, 
        reqEpoch: req.session.reqEpoch};

    case "insert_into_requests_logs":
      return { 
        reqEpoch : req.session.reqEpoch, 
        route: req.route.path,
        methods: req.route.methods
      };

    case "insert_into_responses_logs":
      return {
        reqEpoch : req.session.reqEpoch, 
        time : getEpochString(),
        route: req.route.path,
        statusCode: req.statusCode?.toString
      };

    case "insert_into_errors_logs":
      return {
        reqEpoch : req.session.reqEpoch, 
        time : getEpochString(),
        route: req.route.path,
        error: error 
      };

    case "select_full_logs":
      return {};

    default:
      return {};
  }
}

function updateSessionFromProcedure(
  req: Request,
  pro: DBProcedure,
  output: QueryResult<any>
): void {
  switch (pro) {
    case "check_signin":
      if (output.rows.length === 1) {
        req.session.userId=output.rows[0]["user_id"];
        req.session.artistId=output.rows[0]["artist_id"];
        req.session.userName=output.rows[0]["user_name"];
        console.log('Session updated: ' + req.session);
        } 
      break;
    case "check_signup":
      if (output.rows.length === 1) {
        req.session.userId=output.rows[0]["user_id"];
        req.session.userName=output.rows[0]["user_name"];
        console.log('Session updated: ' + req.session);
      }
      break;
    case "submit_first_work":
        if (output.rows.length === 1) {
          req.session.artistId=output.rows[0]["artist_id"];
          console.log('Session updated: ' + req.session);
        }
        break;
    case "delete_":
      delete req.session.userId;
      if (req.session.artistId) {
        delete req.session.artistId;
      }
      break;
    default: {
      console.log('Session not updated');
    }
  }
}

function updateSessionFromRoutePath(
  req: Request,
  routePath: RoutePath
): void {
  switch (routePath) {
    case "/signout/submit":
      delete req.session.userId;
      if (req.session.artistId) {
        delete req.session.artistId;
      }
      break;
    default: {
      console.log('Session not updated');
    }
  }
}

async function getDBprocedureOuputs<T extends DBProcedure>(
  pool: Pool,
  pro: T,
  args: DBProcedureArgsMappingType[T]
): Promise<Array<DBProcedureResultsMappingType[DBProcedure]>> {
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
  poo : Pool,
  req: Request,
  cb?: (err: Error) => void
): (err: Error) => void {
  function errorHandler(err: Error) {
    const no = getEpochString();
    if (req.session.reqEpoch && req.session.path) {
      const args = getDBprocedureArgs(req,"insert_into_errors_logs",hash,err)
      const resQuery = queryPoolFromProcedure(pool, "insert_into_errors_logs", args);
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
  getDBprocedureArgs,
  updateSessionFromProcedure,
  updateSessionFromRoutePath,
  checkAnswer,
  fallbackToIndex,
  fallbackToHome,
  buildErrorHandler,
};
