
import { StringifyOptions } from 'querystring';
import { Request, Reponse, Error, NextFunction } from 'express';
import { Pool, QueryResult } from 'pg';
import {Session, SessionData} from './express-session';

declare OneMore<T> = T|Array<T>;

declare interface ProcedureOutput<T> {
    watches?:T,
    likes?:T ,
    watchers?:T ,
    liked?:T ,
    moreUsers?:T ,
    moreArtists?:T ,
    moreWorks?:T
}

declare interface PhantomData {
    'pwd':string,
    'workId' :string,
    'workName':string,
    'userArtistId' :string,
    'userWorkId' :string,
    'time' :string,
    'key':string}


type FlowingConcept = keyof ProcedureOutput |keyof SessionData |keyof PhantomData 


declare TypedRoutes = Array<TypedRoute>;

declare type TypedRoute = TypedRouteParams & Controler

declare interface TypedRouteParams {
    url: string,
    verb: string
}

declare interface Controler {
    controler: (err?: Error, req: Request, res: Response, NextFunction?:NextFunction) => void
}

declare interface ControlerCallbacks {
    reqParamsHandler: (req:Response) => ProcedureProps,
    dbHandler?: (props: ProcedureProp) => Promise<OneMore<QueryResult<any>>>,
    propsBuilder: (r: OneMore<QueryResult<any>> ) => RenderableProps,
    outputCallback: (res: Response, props: RenderableProps) => void
}

declare function buildControler(cbs: ControlerCallbacks): Controler;

declare type ProcedureProps = Record<FlowingConcept,string>;

declare function requestParamsHandlerSourcer(req:Response,c:FlowingConcept,s:Source):string;

declare function requestParamsHandlerBuilder(
    sourcer:(req:Response,c:FlowingConcept,s:Source) => string,
    concepts:Record<FlowingConcept,Source>
    )    
declare type Source =
    'unit' |
    'route' |
    'session' |
    'params';



declare interface DBHandlerParams {
    pool: Pool,
    procedures: Array<DBProcedure>
}

declare type DBProcedure = 'generate_user' |
    'generate_user_event' |
    'generate_artist' |
    'generate_artist_event' |
    'generate_work' |
    'generate_work_event' |
    'generate_user_artist' |
    'generate_user_artist_event' |
    'generate_user_work' |
    'generate_user_work_event' |
    'insert_user' |
    'insert_user_event' |
    'insert_artist' |
    'insert_artist_event' |
    'insert_work' |
    'insert_work_event' |
    'insert_user_artist' |
    'insert_user_artist_event' |
    'insert_user_work' |
    'insert_user_work_event' |
    'check_signin' |
    'check_signup'|
    'see_my_watchers' |
    'see_more_users'|
    'see_my_works' |
    'see_more_of_my_works'|
    'see_my_watched_artists' |
    'see_more_artists'|
    'see_my_liked_works' |
    'see_more_works'|
    'view_user'|
    'view_artist'|
    'view_works_of_artists'|
    'view_work'|
    'ban_watcher'|
    'submit_work'|
    'withdraw_work'|
    'submit_first_work'|
    'watch_artist'|
    'unwatch_artist'|
    'like_work'|
    'unlike_work'|
    'insert_into_requests_logs'|
    'insert_into_responses_logs'|
    'insert_into_errors_logs'|
    'select_full_logs';

declare interface DBProcedureParams {
    args:Record<FlowingConcept,Source>
}

declare dBProcedureParams:DBProcedureParams;

declare function dbHandlerBuilder(dBProcedureParams:DBProcedureParam):(props: ProcedureProp) => Promise< OneMore<QueryResult<any>>>;

declare type Renderable = keyof RenderableProps;

declare type  RenderableProps = EjsRenderableProps |
DataRenderableProps |
UrlRenderableProps ;

declare interface EjsRenderableProps {
    ejs:EjsView
};


declare interface DataRenderableProps {
    data:OneMore<{fields:Array<string>,rows:Array<Array<number|string>>}>
};

declare interface UrlRenderableProps {
    'url':string
}

declare function DataPropsBuilderGenerator():((r: OneMore<QueryResult<any>> )=>DataRenderableProps);
declare function UrlPropsBuilderConstantGenerator(url:string):((r: OneMore<QueryResult<any>>)=>UrlRenderableProps);



declare interface propsBuilderParams {
    pool: Pool,
    renderable: Renderable
}

declare function outputCallbackGenerator(renderable: Renderable):(res: Response, props: RenderableProps) => void;


declare type EjsView =
    'Index' |
    'Signin' |
    'Signup' |
    'UserHome' |
    'ArtistHome' |
    'Ban' |
    'Unlike' |
    'Withdraw' |
    'Artist' |
    'User' |
    'Work' |
    'MoreArtist' |
    'MoreUser' |
    'MoreWork' |
    'Logout' |
    'Delete'|
    'Error';

declare interface CellProps {
    value:any,
    link?:string
}

export type {EjsView, FlowingConcept, DBProcedure, ProcedureOutput, CellProps};

