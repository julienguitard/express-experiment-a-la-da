
import { StringifyOptions } from 'querystring';
import { Request, Reponse, Error, NextFunction } from 'express';
import { Pool, QueryResult } from 'pg';
import { Session, SessionData } from './express-session';

declare OneMore<T> = T | Array<T>;

declare interface ProcedureOutput<T> {
    watches?: T,
    likes?: T,
    watchers?: T,
    liked?: T,
    moreUsers?: T,
    moreArtists?: T,
    moreWorks?: T
}

declare interface PhantomData {
    'pwd': string,
    'workId': string,
    'workName': string,
    'userArtistId': string,
    'userWorkId': string,
    'time': string,
    'key': string
}


type UbiquitousConcept = keyof ProcedureOutput | keyof SessionData | keyof PhantomData;

declare type DBProcedure =
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
    'check_signup' |
    'see_my_watchers' |
    'see_more_users' |
    'see_my_works' |
    'see_more_of_my_works' |
    'see_my_watched_artists' |
    'see_more_artists' |
    'see_my_liked_works' |
    'see_more_works' |
    'view_user' |
    'view_artist' |
    'view_works_of_artists' |
    'view_work' |
    'ban_watcher' |
    'submit_work' |
    'withdraw_work' |
    'submit_first_work' |
    'watch_artist' |
    'unwatch_artist' |
    'like_work' |
    'unlike_work' |
    'insert_into_requests_logs' |
    'insert_into_responses_logs' |
    'insert_into_errors_logs' |
    'select_full_logs';

declare type DBProcedureArgsMappingType = {
    insert_user_event: [{ 'userId': string }, { 'time': string }, { 'key': string }],
    insert_artist: [{ 'artistId': string }, { 'time': string }, { 'userId': string }],
    insert_artist_event: [{ 'artistId': string }, { 'time': string }, { 'key': string }],
    insert_work: [{ 'workId': string }, { 'artistId': string }, { 'time': string }, { 'workName': string }],
    insert_user: [{ 'userId': string }, { 'time': string }, { 'userName': string }, { 'pwd': string }],
    insert_work_event: [{ 'workId': string }, { 'time': string }, { 'key': string }],
    insert_user_artist: [{ 'userArtistId': string }, { 'userId': string }, { 'artistId': string }, { 'time': string }],
    insert_user_artist_event: [{ 'userArtistId': string }, { 'time': string }, { 'key': string }],
    insert_user_work: [{ 'userWorkId': string }, { 'userId': string }, { 'workId': string }, { 'time': string }],
    insert_user_work_event: [{ 'userWorkId': string }, { 'time': string }, { 'key': string }],
    check_signin: [{ 'userName': string }, { 'pwd': string }],
    check_signup: [{ 'userName': string }, { 'pwd': string }, { 'confirmedPwd': string }],
    see_my_watchers: [{ 'artistId': string }],
    see_more_users: [{ 'artistId': string }],
    see_my_works: [{ 'artistId': string }],
    see_more_of_my_works: [{ 'artistId': string }],
    see_my_watched_artists: [{ 'userId': string }],
    see_more_artists: [{ 'userId': string }],
    see_my_liked_works: [{ 'userId': string }],
    see_more_works: [{ 'userId': string }],
    view_user: [{ 'artistId': string }, { 'userId': string }],
    view_artist: [{ 'artistId': string }, { 'userId': string }],
    view_works_of_artists: [{ 'artistId': string }, { 'userId': string }],
    view_work: [{ 'userId': string }, { 'workId': string }],
    ban_watcher: [{ 'artistId': string }, { 'userId': string }],
    submit_work: [{ 'artistId': string }, { 'workName': string }],
    withdraw_work: [{ 'artistId': string }, { 'workId': string }],
    submit_first_work: [{ 'userId': string }, { 'workName': string }],
    watch_artist: [{ 'userId': string }, { 'artistId': string }],
    unwatch_artist: [{ 'userId': string }, { 'artistId': string }],
    like_work: [{ 'userId': string }, { 'workId': string }],
    unlike_work: [{ 'userId': string }, { 'workId': string }],
    insert_into_requests_logs: [{ 'time': string }, { 'path': string }, { 'methods': Array<string> }],
    insert_into_responses_logs: [{ 'time': string }, { 'path': string }, { 'methods': Array<string> }, { 'error': Error }],
    insert_into_errors_logs: [{ 'time': string }, { 'path': string }, { 'methods': Array<string> }, { 'error': Error }],
    select_full_logs: []
}

declare type DBProcedureresultsMappingType = {
    insert_user_event: [{ 'userId': string }, { 'time': string }, { 'key': string }],
    insert_artist: [{ 'artistId': string }, { 'time': string }, { 'userId': string }],
    insert_artist_event: [{ 'artistId': string }, { 'time': string }, { 'key': string }],
    insert_work: [{ 'workId': string }, { 'artistId': string }, { 'time': string }, { 'workName': string }],
    insert_user: [{ 'userId': string }, { 'time': string }, { 'userName': string }, { 'pwd': string }],
    insert_work_event: [{ 'workId': string }, { 'time': string }, { 'key': string }],
    insert_user_artist: [{ 'userArtistId': string }, { 'userId': string }, { 'artistId': string }, { 'time': string }],
    insert_user_artist_event: [{ 'userArtistId': string }, { 'time': string }, { 'key': string }],
    insert_user_work: [{ 'userWorkId': string }, { 'userId': string }, { 'workId': string }, { 'time': string }],
    insert_user_work_event: [{ 'userWorkId': string }, { 'time': string }, { 'key': string }],
    check_signin: [{ 'userId': string }, { 'artistId': string?}],
    check_signup: [{ 'userId': string }],
    see_my_watchers: [{ 'userId': { 'userName': string, 'userId': string }, 'ban': string }],
    see_more_users: [{ 'userId': { 'userName': string, 'userId': string }, 'ban': string }],
    see_my_works: [{ 'workId': { 'workName': string, 'workId': string }, 'withdraw': string }],
    see_more_of_my_works: [{ 'workId': { 'workName': string, 'workId': string }, 'withdraw': string }],
    see_my_watched_artists: [{ 'artistId': { 'userName': string, 'artistId': string }, 'watch': string }],
    see_more_artists: [{ 'artistId': { 'userName': string, 'artistId': string }, 'watch': string }],
    see_my_liked_works: [{ 'workId': { 'workName': string, 'workId': string }, 'like': string }],
    see_more_works: [{ 'workId': { 'workName': string, 'workId': string }, 'like': string }],
    view_user: [{ 'userId': { 'userName': string, 'userId': string }, 'ban': string }],
    view_artist: [{ 'artistId': { 'userName': string, 'artistId': string }, 'watch': string }],
    view_works_of_artists: [{ 'workId': { 'workName': string, 'workId': string }, 'like': string }],
    view_work: [{ 'workId': { 'workName': string, 'workId': string }, 'like': string }],
    ban_watcher: [{ 'userId': { 'userName': string, 'userId': string }, 'ban': string }],
    submit_work: [{ 'workId': string }],
    withdraw_work: [{ 'workId': string }],
    submit_first_work: [{ 'artistId': string }, { 'workId': string }],
    watch_artist: [{ 'artistId': string }],
    unwatch_artist: [{ 'artistId': string }],
    like_work: [{ 'workId': string }],
    unlike_work: [{ 'workId': string }],
    insert_into_requests_logs: [{ 'time': string }, { 'path': string }, { 'methods': Array<string> }],
    insert_into_responses_logs: [{ 'time': string }, { 'path': string }, { 'methods': Array<string> }, { 'error': Error }],
    insert_into_errors_logs: [{ 'time': string }, { 'path': string }, { 'methods': Array<string> }, { 'error': Error }],
    select_full_logs: []
}

declare type EjsView =
    'Index' |
    'Signin' |
    'Signup' |
    'UserHome' |
    'ArtistHome' |
    'Ban' |
    'Unlike' |
    'Submit' |
    'Withdraw' |
    'Unwatch'|
    'Artist' |
    'User' |
    'Work' |
    'MoreArtist' |
    'MoreUser' |
    'MoreWork' |
    'Logout' |
    'Delete' |
    'Error';

declare type EjsViewPropsMappingType = {
    Index: { userName: string?, startTime: string?},
    Signin: { startTime: string?},
    Signup: { startTime: string?},
    UserHome: {
        userName: string, 
        startTime: string,
        myWatchedArtists: Array<{ 'artistId': { 'userName': string, 'artistId': string }, 'watch': string }>,
        myLikedWorks: Array<{ 'workId': { 'workName': string, 'workId': string }, 'like': string }>
    },
    ArtistHome: {
        userName: string, 
        startTime: string,
        myWatchers:Array<{ 'userId': { 'userName': string, 'userId': string }, 'ban': string }>,
        myWorks:Array<{ 'workId': { 'workName': string, 'workId': string }, 'withdraw': string }>,
        myWatchedArtists: Array<{ 'artistId': { 'userName': string, 'artistId': string }, 'watch': string }>,
        myLikedWorks: Array<{ 'workId': { 'workName': string, 'workId': string }, 'like': string }>
    },
    Ban:{userName: string, startTime: string,userId:string},//TO DO
    Unlike:{userName: string, startTime: string,workId:string},
    Submit:{userName: string, startTime: string},
    Withdraw:{userName: string, startTime: string, workId:string},
    Unwatch:{userName: string, startTime: string, artistId:string}
}


declare TypedRoutes = Array<TypedRoute>;

declare type TypedRoute = TypedRouteParams & Controler

declare interface TypedRouteParams {
    url: string,
    verb: string
}

declare interface Controler {
    controler: (err?: Error, req: Request, res: Response, NextFunction?: NextFunction) => void
}

declare interface ControlerCallbacks {
    reqParamsHandler: (req: Response) => ProcedureProps,
    dbHandler?: (props: ProcedureProp) => Promise<OneMore<QueryResult<any>>>,
    propsBuilder: (r: OneMore<QueryResult<any>>) => RenderableProps,
    outputCallback: (res: Response, props: RenderableProps) => void
}

declare function buildControler(cbs: ControlerCallbacks): Controler;

declare type ProcedureProps = Record<UbiquitousConcept, string>;

declare function requestParamsHandlerSourcer(req: Response, c: UbiquitousConcept, s: Source): string;

declare function requestParamsHandlerBuilder(
    sourcer: (req: Response, c: UbiquitousConcept, s: Source) => string,
    concepts: Record<UbiquitousConcept, Source>
)
declare type Source =
    'unit' |
    'route' |
    'session' |
    'body' |
    'params';



declare interface DBHandlerParams {
    pool: Pool,
    procedures: Array<DBProcedure>
}



declare interface DBProcedureParams {
    args: Record<UbiquitousConcept, Source>
}

declare dBProcedureParams: DBProcedureParams;

declare function dbHandlerBuilder(dBProcedureParams: DBProcedureParam): (props: ProcedureProp) => Promise<OneMore<QueryResult<any>>>;

declare type Renderable = keyof RenderableProps;

declare type RenderableProps = EjsRenderableProps |
    DataRenderableProps |
    UrlRenderableProps;

declare interface EjsRenderableProps {
    ejs: EjsView
};


declare interface DataRenderableProps {
    data: OneMore<{ fields: Array<string>, rows: Array<Array<number | string>> }>
};

declare interface UrlRenderableProps {
    'url': string
}

declare function DataPropsBuilderGenerator(): ((r: OneMore<QueryResult<any>>) => DataRenderableProps);
declare function UrlPropsBuilderConstantGenerator(url: string): ((r: OneMore<QueryResult<any>>) => UrlRenderableProps);



declare interface propsBuilderParams {
    pool: Pool,
    renderable: Renderable
}

declare function outputCallbackGenerator(renderable: Renderable): (res: Response, props: RenderableProps) => void;




declare interface CellProps {
    value: any,
    link?: string
}

export type { EjsView, UbiquitousConcept, DBProcedure, ProcedureOutput, CellProps };

