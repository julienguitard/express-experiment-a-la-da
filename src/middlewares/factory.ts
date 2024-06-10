import { Request, Response, NextFunction } from "express";
import { Session } from "../express-session";
import pg, { PoolConfig, Pool, QueryResult } from "pg";
import { pool, queryPool, queryPoolFromProcedure } from "../databases/index.js";
import { RouteData, Controler, RoutePath, DBProcedure } from "../types";
import {
  parseSQLOutput,
  checkAnswer,
  fallbackToIndex,
  fallbackToHome,
  buildErrorHandler,
  getEpochString,
} from "./handlers";
import {promiseRecord} from "../utils/naturalTransformations";
import {hash} from "../utils/hash";
import {mergeInto,updateInto} from "../utils/objectTransformations";
import { request } from "http";

/*function buildControler(reqParamsHandler: (route: TypedRequest<TypedSession>["route"], session: TypedRequest<TypedSession>["session"], params: TypedRequest<TypedSession>["params"]) => Record<string, any>,
    dbHandler: (params: Record<string, any>) => Promise<QueryResult<any>>,
    propsBuilder: (r: QueryResult<any>) => any,
    outputCallback: (res: Response, props: any) => void) {
    async function mdw(req: Request, res: Response, next: NextFunction) {
        const queryParams = reqParamsHandler(req.route, req.session, req.params);
        const queryRes = dbHandler(queryParams);
        const props = queryRes.then(propsBuilder).catch(e => console.log('Database error :' + e));
        const send = props.then(outputCallback).catch(e => console.log('Props builder error :' + e));
        next();
    }
    return mdw;
}*/

function buildControler(
  data: Record<string, string>
): (req: Request, res: Response, next: NextFunction) => void {
  function mdw(req: Request, res: Response, next: NextFunction) {
    if (data.redirect !== undefined) {
      res.redirect(data.redirect);
    } else if (data.render !== undefined) {
      res.render(data.render);
    } else {
      next(Error("Unmatched case"));
    }
    next();
  }
  return mdw;
}

function buildParametrizedControler(
  data: RouteData
): (req: Request, res: Response, next: NextFunction) => void {
  function mdw(req: Request, res: Response, next: NextFunction) {
    if (data.redirect !== undefined) {
      res.redirect(data.redirect);
    } else if (data.render !== undefined) {
      console.log(data.render, req.session);
      try {
        res.render("./" + data.render, req.session);
      } catch (error) {
        next(error);
      }
    } else {
      throw Error("Unmatched case");
    }
    next();
  }
  return mdw;
}

function builder(rou: RoutePath): Controler {
  let mdw = async function (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {};
  switch (rou) {
    case "/":
      mdw = async function (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        res.render("Index", req.session);
      };
      break;
    case "/landing/signin":
      mdw = async function (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        res.render("SignIn", req.session);
      };
      break;
    case "/landing/signup":
      mdw = async function (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        res.render("Signup", req.session);
      };
      break;
    case "/landing/signin/submit":
      mdw = async function (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        const procParams = [req.body.userName, req.body.pwd];
        const procResults = queryPoolFromProcedure(
          pool,
          "check_signin",
          procParams
        );
        const updateReq = procResults
          .then((r) => {
            if (r.rows.length === 1) {
              req.session.userId = r.rows[0]["user_id"];
              req.session.userName = r.rows[0]["user_name"];
              req.session.artistId =
                r.rows[0]["artist_id"] === "null"
                  ? undefined
                  : r.rows[0]["artist_id"];
            }
          })
          .catch((err) => buildErrorHandler(err,(e)=>{fallbackToIndex(res)}));
        const updateRes = updateReq.then(() => {
          console.log(req.session.userId);
          if (req.session.userId) {
            res.redirect("/home");
          } else {
            res.redirect("/");
          }
        });
      };
      break;
    case "/landing/signup/submit":
      mdw = async function (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        const procParams = (req.body.pwd === req.body.confirmedPwd)?[
          hash(req.body.userName),
          getEpochString(),
          req.body.userName,
          hash(req.body.pwd),
        ]:undefined;
        const procResults = queryPoolFromProcedure(
          pool,
          "check_signup",
          procParams
        );
        const updateReq = procResults
          .then((r) => {
            if (r.rows.length === 1) {
              req.session.userId = r.rows[0]["user_id"];
              req.session.userName = r.rows[0]["user_name"];
              req.session.artistId = undefined;
            }
          })
          .catch((err) => buildErrorHandler(err));
        const updateRes = updateReq.then(() => {
          if (req.session.userId) {
            res.redirect("/home");
          } else {
            res.redirect("/");
          }
        });
      };
      break;
    case "/home":
      mdw = async function (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        if (req.session.artistId && req.session.userId) {
          const procParams: Record<DBProcedure, Array<string>> = {
            see_my_watchers: [req.session.artistId],
            see_my_works: [req.session.artistId],
            see_my_watched_artists: [req.session.userId],
            see_my_liked_works: [req.session.userId],
          };
          const procResults = Object.fromEntries(
            Object.entries(procParams).map((kv) => [
              kv[0],
              queryPoolFromProcedure(pool, kv[0], kv[1]),
            ])
          );
          const updateRes = res.render("ArtistHome", {
            ...req.session,
            ...procResults,
          });
        } else if (req.session.userId) {
          const procParams: Record<DBProcedure, Array<string>> = {
            see_my_watched_artists: [req.session.userId],
            see_my_liked_works: [req.session.userId],
          };
          const procResults = Object.fromEntries(
            Object.entries(procParams).map((kv) => [
              kv[0],
              queryPoolFromProcedure(pool, kv[0], kv[1]),
            ]))
          ;
          const updateRes = res.render("UserHome", {
            ...req.session,
            ...procResults,
          });
        }
      };
      break;

    default:
      mdw = function (req: Request, res: Response, next: NextFunction): void {
        next();
      };
  }
  return mdw;
}

export { buildControler, buildParametrizedControler, builder };
