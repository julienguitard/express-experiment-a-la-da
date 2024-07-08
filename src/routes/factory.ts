import  {Router, Request, Response, NextFunction} from 'express'
import { SessionLevel } from '../express-session';
import { RoutePath, RoutePathLevelData, RouteData } from '../types';
import {
  consoleControler,
  sessionFirstUpdateControler,
  logToPostgresControler,
} from "../middlewares/index.js";
import {Pool} from "pg";
import {pool, queryPool, queryPoolFromProcedure } from '../databases/index';
import { builderFromRoutePath } from "../middlewares/factory.js";
import { hash } from "../utils/hash";

function buildRoutesFromDBProcedureDict(
  routeDBProcedureDict: Record<
    RoutePath,
    Record<SessionLevel, RoutePathLevelData>
  >,
  pool: Pool): Array<RouteData> {
  const routes: Array<RouteData> = Object.entries(routeDBProcedureDict).map(
    ([k, v], i) => {
      return {
        route: k as RoutePath,
        method: (Object.entries(v).filter(([vk, vv]) => (vv.method === ('post' as Verb))).length > 0) ? ('post' as Verb) : ('get' as Verb),
        controlers: [
          consoleControler,
          sessionFirstUpdateControler,
          logToPostgresControler,
          builderFromRoutePath(k as RoutePath, v, pool, hash),
        ],
      };
    }
  );
  return routes
}


function setRouteMethod(rou:Router, 
  method:string, 
  route:string, 
  controlers:Array<(req: Request, res: Response, next: NextFunction)=>void>) {
    switch (method) {
      case 'get':
        rou.get(route, controlers);
        break;
      case 'post':
        rou.post(route, controlers);
        break;
      case 'update':
        rou.put(route, controlers);
        break;
      case 'delete':
        rou.delete(route, controlers);
        break;
      default:
        console.log('Unknow method');
    }
    ;
  }

function generateRouter(
  routeDBProcedureDict:Record<
  RoutePath,
  Record<SessionLevel, RoutePathLevelData>
>,
pool:Pool):Router{
  const router:Router = Router();
  const routes: Array<RouteData> = buildRoutesFromDBProcedureDict(routeDBProcedureDict,pool);
  routes.map((r)=>setRouteMethod(router, r.method, r.route, r.controlers));
  return router;

}

export {setRouteMethod, buildRoutesFromDBProcedureDict,generateRouter};