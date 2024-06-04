import express, { Request, Response, NextFunction } from 'express';
import { copyFile } from 'fs';
import pg, { PoolConfig, Pool, QueryResult } from 'pg';
import {TypedRequest, TypedSession} from 'types';


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

function buildControler(data: Record<string,string>): (req: Request, res: Response, next: NextFunction) => void {
    function mdw(req: Request, res: Response, next: NextFunction) {
        if (data.redirect!==undefined) {
            res.redirect(data.redirect);
        }
        else if (data.render!==undefined){
            res.render(data.render);
        }
        else {
            next(Error("Unmatched case"));
        }
        next();
    }
    return mdw;
}

function buildParametrizedControler(data: Record<string,string>): (req: Request, res: Response, next: NextFunction) => void {
    function mdw(req: Request, res: Response, next: NextFunction) {
        if (data.redirect!==undefined) {
            res.redirect(data.redirect);
        }
        else if (data.render!==undefined){
            console.log(data.render,req.session);
            try {
                res.render(data.render,req.session);
            }
            catch (error) {
                next(error);
            }
        }
        else {
            throw Error("Unmatched case");
        }
        next();
    }
    return mdw;
}


export { buildControler,buildParametrizedControler}