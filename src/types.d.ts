
import { StringifyOptions } from 'querystring';
import { Request, Reponse, Error, NextFunction } from 'express';
import { Session, SessionData } from 'express-session';
import { SessionData } from "./middlewares/handlers";
import { Pool } from 'pg';

declare OneMore<T> = T|Array<T>;


declare interface SqlOutput {
    watches?:string,
    likes?:string,
    watchers?:string,
    liked?:string,
    moreUsers?:string,
    moreArtists?:string,
    moreWorks?:string
}

declare interface PhantomData {
    'pwd':string,
    'workId' :string,
    'workName':string,
    'userArtistId' :string,
    'userWorkId' :string,
    'time' :string,
    'key'}

declare interface TypedSession extends Session {
    startTime?:string,
    reqTime?:string,
    userId?:string,
    userName?:string,
    artistId?:string,
    sqlOutput?:string
}

declare interface TypedRequest<T> extends Request
{
    session:T
}

type FlowingConcept = keyof SqlOutput |keyof TypedSession |keyof PhantomData 


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

declare type DBProcedure = 'generate_user_from_req' |
    'generate_user_event_from_req' |
    'generate_artist_from_req' |
    'generate_artist_event_from_req' |
    'generate_work_from_req' |
    'generate_work_event_from_req' |
    'generate_user_artist_from_req' |
    'generate_user_artist_event_from_req' |
    'generate_user_work_from_req' |
    'generate_user_work_event_from_req' |
    'insert_user_event_from_req' |
    'insert_artist_from_req' |
    'insert_artist_event_from_req' |
    'insert_work_from_req' |
    'insert_work_event_from_req' |
    'insert_user_artist_from_req' |
    'insert_user_artist_event_from_req' |
    'insert_user_work_from_req' |
    'insert_user_work_event_from_req' |
    'check_login_from_req' |
    'see_my_watched_artists_from_req' |
    'see_more_artists_from_req';

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


export type {TypedSession,TypedRequest,EjsView, FlowingConcept};

