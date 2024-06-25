import { Request, Response, NextFunction } from "express";
import { Session, SessionLevel} from "../express-session";
import pg, { PoolConfig, Pool, QueryResult } from "pg";
import { pool, queryPool, queryPoolFromProcedure } from "../databases/index.js";
import { RouteData, Controler, RoutePath, DBProcedure, EjsView, RouteEvent, Verb, RoutePathLevelData} from "../types";
import {
  getSessionLevel,
  assertDBprocedureArgs,
  getDBprocedureArgs,
  manageFallbackFromRoutePath,
  updateSessionFromProcedure,
  updateSessionFromRoutePath,
} from "./handlers";
import {mapDict, promiseRecord} from "../utils/naturalTransformations";
import {hash} from "../utils/hash";
import {mergeInto,updateInto} from "../utils/objectTransformations";
import { parseSQLOutput } from "../databases/factory";



function builderFromRoutePath(
  routePath : RoutePath,
  routePathData :Record<SessionLevel, RoutePathLevelData>,
  hash:(s: string) => string,
):(req:Request,res:Response,next:NextFunction)=>void{
  function mdw(req:Request,res:Response,next:NextFunction):void{
    const level = getSessionLevel(req.session);
    const routePathSessionData = routePathData[level];
    const promises:Promise<QueryResult<any>>[] = routePathSessionData.dbProcedures.map((pro:DBProcedure)=>{
      let args = assertDBprocedureArgs(req, pro, getDBprocedureArgs(req,pro,hash));
      let output = args.then((a)=>{
        console.log(a);
        return queryPoolFromProcedure(pool,pro,a)
      });
      output= output.then((ou)=>{console.log(parseSQLOutput(ou));return ou});
      output = output.then((ou)=> {updateSessionFromProcedure(req,pro,ou);console.log(req.session); return ou});
      return output;
    })
    let promise = Promise.all(promises);
    promise = promise.then((r) => {updateSessionFromRoutePath(req,routePath);console.log(req.session); return r})
    promise.then((r)=>{
      if (routePathSessionData.render){
        console.log('rendering');
        console.log(mergeInto(req.session)(r));
        res.render(routePathSessionData.render,mergeInto(req.session)(r));
      }
      else if(routePathSessionData.redirect){
        console.log('redirect');
        res.redirect(routePathSessionData.redirect);
      }
      else {
        console.log('Must be either render or redirect');
      }
    }).catch((e)=>{(routePathSessionData.fallback)?res.redirect(routePathSessionData.fallback):res.render('Error',e);})
  }
  return mdw;
}
  

export { builderFromRoutePath };
