import { Request, Response } from "express";
import { Pool, QueryResult } from "pg";
import { queryPool, queryPoolFromProcedure } from "../databases/index.js";
import { hash } from "../utils/hash.js";
import { Session, SessionData, SessionLevel } from "express-session";
import {
  RouteEvent,
  DBProcedure,
  DBProcedureArgsMappingType,
  DBProcedureResultsMappingType,
  RoutePath,
  CellProps
} from "../types";
import { loadEnvFile } from "process";

function getEpochString(): string {
  return (Date.now() / 1000).toString();
}

function updateSessionInitially(session: SessionData, req: Request): void {
  session.reqEpoch = getEpochString();
  session.startTime = session.startTime ?? getEpochString();
  session.views = (session.views ?? 0) + 1;

  if (req.route) {
    session.path = req.route.path;
  } else {
    session.path = "Unknown route";
  }

  if (session.params) {
    delete session.params;
  }

}

function getSessionLevel(session: SessionData): SessionLevel {
  let level: SessionLevel = 'NotSignedin';
  if (session.artistId) {
    level = 'SignedinAsArtist';
  } else if (session.userId) {
    level = 'SignedinAsUser';
  } else {
  }
  return level;
}

async function assertDBprocedureArgs<T extends keyof DBProcedureArgsMappingType>(
  req: Request,
  pro: T,
  args: DBProcedureArgsMappingType[T]
): Promise<DBProcedureArgsMappingType[T]> {
  switch (pro) {
    case "check_signup":
      if (req.body.pwd === req.body.confirmedPwd) {
        return await args;
      }
      else {
        throw Error('Args, not validated');
      }
    case "withdraw_work":
      if (req.params.artistId === req.session.artistId) {
        return await args;
      }
      else {
        throw Error('Args, not validated');
      }
    case "ban_watcher":
      if (req.params.artistId === req.session.artistId) {
        return await args;
      }
      else {
        throw Error('Args, not validated');
      }
    case "watch_artist":
      if (req.params.userId === req.session.userId) {
        return await args;
      }
      else {
        throw Error('Args, not validated');
      }

    case "rewatch_artist":
      if (req.params.userId === req.session.userId) {
        return await args;
      }
      else {
        throw Error('Args, not validated');
      }

    case "unwatch_artist":
      if (req.params.userId === req.session.userId) {
        return await args;
      }
      else {
        throw Error('Args, not validated');
      }

    case "like_work":
      if (req.params.userId === req.session.userId) {
        return await args;
      }
      else {
        throw Error('Args, not validated');
      }
    case "unlike_work":
      if (req.params.userId === req.session.userId) {
        return await args;
      }
      else {
        throw Error('Args, not validated');
      }
    default:
      return await args;
  }
}

function getDBprocedureArgs<T extends keyof DBProcedureArgsMappingType>(
  req: Request,
  pro: T,
  hash: (s: string) => string,
  error?: Error
): DBProcedureArgsMappingType[DBProcedure] {
  switch (pro) {
    case "check_signin":
      return {
        userName: req.body.userName,
        pwd: hash(req.body.pwd)
      };

    case "check_signup":
      return {
        userId: hash(req.body.userName),
        reqEpoch: req.session.reqEpoch,
        userName: req.body.userName,
        pwd: hash(req.body.pwd),
        confirmedPwd: hash(req.body.confirmedPwd)
      }

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
        reqEpoch: req.session.reqEpoch,
        workName: req.body.workName
      };

    case "submit_work":
      return {
        workId: hash(req.session.artistId + req.body.workName),
        artistId: req.session.artistId,
        reqEpoch: req.session.reqEpoch,
        workName: req.body.workName
      };

    case "withdraw_work":
      return {
        workId: req.params.workId,
        reqEpoch: req.session.reqEpoch
      };

    case "see_more_artists":
      return { userId: req.session.userId };

    case "see_more_works":
      return { userId: req.session.userId };

    case "view_user"://TO DO
      return { artistId: req.session.artistId, userId: req.params.userId };

    case "view_artist"://TO DO
      return {
        userWorkId: hash(req.session.userId + req.params.artistId), 
        userId: req.session.userId,
        workId: req.params.artistId, 
        reqEpoch: req.session.reqEpoch 
      };

    case "view_works_of_artist"://TO DO
      return { artistId: req.params.artistId};

    case "view_work":
      return {
        userWorkId: hash(req.session.userId + req.params.workId), 
        userId: req.session.userId,
        workId: req.params.workId, 
        reqEpoch: req.session.reqEpoch 
      };

    case "ban_watcher":
      return {
        userArtistId: req.params.userArtistId,
        reqEpoch: req.session.reqEpoch
      };
    case "watch_artist":
      return {
        userArtistId: req.params.userArtistId,
        reqEpoch: req.session.reqEpoch
      };

    case "unwatch_artist":
      return {
        userArtistId: req.params.userArtistId,
        reqEpoch: req.session.reqEpoch
      };

    case "like_work":
      return {
        userWorkId: req.params.userWorkId,
        reqEpoch: req.session.reqEpoch
      };

    case "unlike_work":
      return {
        userWorkId: req.params.userWorkId,
        reqEpoch: req.session.reqEpoch
      };

    case "delete_":
      return {
        userId: req.session.userId,
        reqEpoch: req.session.reqEpoch
      };

    case "insert_into_requests_logs":
      return {
        reqEpoch: req.session.reqEpoch,
        route: req.route.path,
        methods: req.route.methods
      };

    case "insert_into_responses_logs":
      return {
        reqEpoch: req.session.reqEpoch,
        time: getEpochString(),
        route: req.route.path,
        statusCode: req.statusCode?.toString
      };

    case "insert_into_errors_logs":
      return {
        reqEpoch: req.session.reqEpoch,
        time: getEpochString(),
        route: req.route.path,
        error: error
      };

    case "select_full_logs":
      return {};

    default:
      return {};
  }
}

function transformDBprocedureOutputs<T extends keyof DBProcedureArgsMappingType>(
  pro: T,
  r: QueryResult<any>
): DBProcedureArgsMappingType[DBProcedure] {
  switch (pro) {
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

    case "see_more_users"://TO DO
      return { artistId: req.session.artistId };

    case "see_more_works"://TO DO
      return { artistId: req.session.userId };

    case "see_more_artists"://TO DO
      return { userId: req.session.userId };

    case "see_more_works"://TO DO
      return { userId: req.session.userId };

    case "view_user"://TO DO
      return { artistId: req.session.artistId, userId: req.params.userId };

    case "view_artist"://TO DO
      return { artistId: req.params.artistId, userId: req.session.userId };

    case "view_works_of_artist"://TO DO
      return { artistId: req.params.artistId, userId: req.session.userId };

    case "view_work"://TO DO
      return { userId: "string", workId: "string" };

    case "go_view_work"://TO DO
      return { userId: req.session.userId, workId: "string" };
    case "go_review_work"://TO DO
      return { userWorkIdId: "string" }

    default:
      return r;
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
        req.session.userId = output.rows[0]["user_id"];
        req.session.artistId = output.rows[0]["artist_id"];
        req.session.userName = output.rows[0]["user_name"];
      }
      break;
    case "check_signup":
      if (output.rows.length === 1) {
        req.session.userId = output.rows[0]["user_id"];
        req.session.userName = output.rows[0]["user_name"];
      }
      break;
    case "submit_first_work":
      if (output.rows.length === 1) {
        req.session.artistId = output.rows[0]["artist_id"];
      }
      break;
    case "delete_":
      delete req.session.userId;
      delete req.session.userName;
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
      delete req.session.userName;
      if (req.session.artistId) {
        delete req.session.artistId;
      }
      break;
    default: {
      if (req.params) {
        req.session.params = req.params;
      }
    }
  }
}

function manageFallbackFromRoutePath(
  res: Response,
  routePath: RoutePath,
  fallback?: RoutePath
): void {
  if (fallback) {
    res.redirect(fallback);
  }
  else {
    res.redirect('Error');
  }
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
  poo: Pool,
  req: Request,
  cb?: (err: Error) => void
): (err: Error) => void {
  function errorHandler(err: Error) {
    const no = getEpochString();
    if (req.session.reqEpoch && req.session.path) {
      const args = getDBprocedureArgs(req, "insert_into_errors_logs", hash, err)
      const resQuery = queryPoolFromProcedure(pool, "insert_into_errors_logs", args);
      if (cb) {
        cb(err);
      }
    }
  }
  return errorHandler;
};



export {
  getEpochString,
  updateSessionInitially,
  getSessionLevel,
  assertDBprocedureArgs,
  getDBprocedureArgs,
  updateSessionFromProcedure,
  updateSessionFromRoutePath,
  manageFallbackFromRoutePath,
  buildErrorHandler,
};
