import express, {Request,Response,NextFunction} from 'express';
import  pg, {PoolConfig,Pool,QueryResult} from 'pg';


function buildMiddleware(reqParamsHandler:(route:Request["route"],session:Request["session"],params:Request["params"]) =>Record<string,any>, 
    dbHandler:(params:Record<string,any>) => Promise<QueryResult<any>> ,
    propsBuilder: (r:QueryResult<any>)=>any,
    outputCallback : (res:Response, props:any)=>void) {
    async function mdw (req:Request,res:Response,next:NextFunction) {
        const queryParams  = reqParamsHandler(req.route,req.session,req.params);
        const queryRes = dbHandler(queryParams);
        const props = queryRes.then(propsBuilder).catch(e=>console.log('Database error :' + e));
        const send = props.then(outputCallback).catch(e=>console.log('Props builder error :' + e));
        next();
    }
    return mdw;
}

export {buildMiddleware}