import { StringifyOptions } from "querystring";
import { Request, Reponse, Error, NextFunction } from "express";
import { Pool, QueryResult } from "pg";
import { Session, SessionData } from "./express-session";

declare type OneMore<T> = [T, Array<T>];


declare type RoutePath =
    | "/"
    | "/landing/signin"
    | "/landing/signup"
    | "/landing/signin/submit"
    | "/landing/signup/submit"
    | "/home"
    | "/home/users/more"
    | "/home/works/more"
    | "/home/artists/more"
    | "/home/works/like/more"
    | "/home/works/more"
    | "/home/works/firstSubmit"
    | "/home/works/firstSubmit/submit"
    | "/home/works/submit"
    | "/home/works/submit/submit"
    | "/home/works/withdraw"
    | "/home/works/withdraw/submit"
    | "/profile/users/user/:userId"
    | "/profile/artists/artist/:artistId"
    | "/profile/works/work/:workId/view"
    | "/profile/works/work/:userWorkId/review"
    | "/profile/works/work/:workId"
    | "/profile/users/user/:userArtistId/ban"
    | "/profile/users/user/:userArtistId/ban/submit"
    | "/profile/artists/artist/:artistId/watch"
    | "/profile/artists/artist/:userArtistId/unwatch"
    | "/profile/artists/artist/:userArtistId/rewatch"
    | "/profile/works/work/:userWorkId/like"
    | "/profile/works/work/:userWorkId/unlike"
    | "/signout"
    | "/signout/submit"
    | "/delete"
    | "/delete/submit";


declare type Redirection = keyof RedirectionArgsMappingType;

declare type RedirectionArgsMappingType = {
    "/home": {},
    "/": {},
    "/profile/works/work/:workId":{}
}

declare type RouteEvent = 'create'
|'delete'
|'submit'
|'withdraw'
|'ban'
|'watch'
|'unwatch'
|'view'
|'like'
|'unlike';

declare type Verb = 'get' | 'post'
declare type RoutePathParams = Record<
    RoutePath,
    { render: EjsView } | ({ redirect: Redirection } & { method?: Verb })
>;

declare type RouteData = {
    route: RoutePath;
    method: Verb;
    controlers: Array<Controler>;
}

declare type EjsView = keyof EjsViewPropsMappingType;

declare type EjsViewPropsMappingType = {
    Index: { userName: string?; startTime: string },
    Signin: { startTime: string },
    Signup: { startTime: string },
    UserHome: {
        userName: string,
        startTime: string,
        myWatchedArtists: Array<{
            artistId: { userName: string, artistId: string },
            watch: string,
        }>,
        myLikedWorks: Array<{
            workId: { workName: string, workId: string },
            like: string,
        }>,
    },
    ArtistHome: {
        userName: string,
        startTime: string,
        myWatchers: Array<{
            userId: { userName: string, userId: string },
            ban: string,
        }>,
        myWorks: Array<{
            workId: { workName: string, workId: string },
            withdraw: string,
        }>,
        myWatchedArtists: Array<{
            artistId: { userName: string, artistId: string },
            watch: string,
        }>,
        myLikedWorks: Array<{
            workId: { workName: string, workId: string },
            like: string,
        }>,
    },
    Ban: { userName: string, startTime: string, userId: string }, //TO DO
    Submit: { userName: string, startTime: string },
    Withdraw: { userName: string, startTime: string, workId: string },
    Signout: { userName: string, startTime: string },
    Delete: { userName: string, startTime: string },
    Work: {
        workId: { workName: string, workId: string },
        withdraw: string,
    },
    Artist: {
        artistId: { userName: string, artistId: string },
        watch: string,
        works: Array<{
            workId: { workName: string, workId: string },
            withdraw: string,
        }>
    },
    User: {
        userId: { userName: string, userId: string },
        ban: string,
    },
    MoreUsers: Array<{
        userId: { userName: string, userId: string },
        ban: string,
    }>,
    MoreArtists: Array<{
        artistId: { userName: string, artistId: string },
        watch: string,
    }>,
    MoreWorks: Array<{
        workId: { workName: string, workId: string },
        like: string,
    }>,
}



declare interface ProcedureOutput<T> {
    watches?: T;
    likes?: T;
    watchers?: T;
    liked?: T;
    moreUsers?: T;
    moreArtists?: T;
    moreWorks?: T;
}

declare interface PhantomData {
    pwd: string,
    workId: string,
    workName: string,
    userArtistId: string,
    userWorkId: string,
    reqEpoch: string,
    key_: string,
}

type UbiquitousConcept =
    | keyof ProcedureOutput
    | keyof SessionData
    | keyof PhantomData;

declare type DBProcedure =
    | keyof DBProcedureArgsMappingType
    | keyof DBProcedureResultsMappingType;

declare type DBProcedureArgsMappingType = {
    insert_user: { userId: string, reqEpoch: string, userName: string,  pwd: string },
    insert_user_event: { userId: string, reqEpoch: string,key_: string },
    insert_artist: { artistId: string,userId: string,reqEpoch: string},
    insert_artist_event: { artistId: string, reqEpoch: string, key_: string },
    insert_work:{ workId: string, artistId: string, reqEpoch: string, workName: string },
    insert_work_event: { workId: string,reqEpoch: string,key_: string },
    insert_user_artist: { userArtistId: string, userId: string, artistId: string, reqEpoch: string },
    insert_user_artist_event:{ userArtistId: string, reqEpoch: string, key_: string },
    insert_user_work: { userWorkId: string,  userId: string, workId: string, reqEpoch: string },
    insert_user_work_event:{ userWorkId: string,  reqEpoch: string, key_: string },
    check_signin:{ userName: string,pwd: string },
    check_signup: { userId : string, reqEpoch:string, userName: string, pwd: string },
    see_watchers:{ artistId: string },
    see_works:{ artistId: string },
    see_watched_artists: { userId: string },
    see_liked_works: { userId: string },
    submit_first_work: { workId: string, artistId: string,user_id:string, reqEpoch:string, workName: string },
    submit_work: { workId: string, artistId: string,reqEpoch:string, workName: string },
    withdraw_work:  { workId: string, reqEpoch:string },
    see_more_users:{ artistId: string },//TO DO
    see_more_liked_works: { artistId: string },//TO DO
    see_more_artists:{ userId: string },//TO DO
    see_more_liked_works:{ userId: string },//TO DO
    view_user:{ artistId: string,userId: string },//TO DO
    view_artist:{ artistId: string,userId: string },//TO DO
    view_works_of_artist:{ artistId: string,userId: string },//TO DO
    view_work:{ userId: string,workId: string },//TO DO
    ban_watcher:{ userArtistId: string,reqEpoch:string},
    watch_artist:{ userArtistId: string, userId: string,artistId: string, reqEpoch:string },
    rewatch_artist:{ userArtistId: string,reqEpoch:string},
    unwatch_artist: { userId: string,artistId: string },
    go_view_work:{ userId: string,workId: string };//TO DO
    go_review_work:{ userWorkIdId: string },//TO DO
    like_work:{ userWorkId: string, reqEpoch:string},
    unlike_work:{ userWorkId: string,reqEpoch:string },
    delete_:{ userId: string, reqEpoch: string},
    insert_into_requests_logs: { reqEpoch: string, time_:string, route: string, methods: Array<string> },
    insert_into_responses_logs: { reqEpoch: string, time_:string, route: string,  statusCode: string },
    insert_into_errors_logs:{ reqEpoch: string, time_:string, route: string ,  message: string },
    select_full_logs: {},
}

declare type DBProcedureResultsMappingType = {
    insert_user: { userId: string, creationTime: string, userName: string,  pwd: string },
    insert_user_event: { id:string, userId: string,time: string,key_: string, value:string },
    insert_artist: { artistId: string, userId: string,creationTime: string},
    insert_artist_event: { id:string, artistId: string,time: string,key_: string, value:string },
    insert_work:{ workId: string, artistId: string, creationTime: string, workName: string },
    insert_work_event: { id:string, wokId: string,time: string,key_: string, value:string },
    insert_user_artist: { userArtistId: string, userId: string, artistId: string, creationTime: string },
    insert_user_artist_event: { id:string,  userArtistId: string,time: string,key_: string, value:string },
    insert_user_work: { userWorkId: string,  userId: string, workId: string, creationTime: string },
    insert_user_work_event:{ id:string,  userWorkId: string,time: string,key_: string, value:string },
    check_signin: { userId: string, artistId?: string, userName: string},
    check_signup: { userId: string, userName: string },
    see_watchers: { user: { userName: string, userId: string }, ban: string },
    see_works: { work: { workName: string, workId: string }, withdraw: string },
    see_watched_artists: { artist: { userName: string, artistId: string }, unwatch: string },
    see_liked_works: { work: { workName: string, workId: string }, unlike: string },
    submit_first_work: { workId: string, artistId: string, creationTime: string, workName: string },
    submit_work: { workId: string, artistId: string, creationTime: string, workName: string },
    withdraw_work: { id:string, workId: string,time: string,key_: string, value:string },
    see_more_users: { userId: { userName: string, userId: string } },
    see_more_liked_works: { workId: { workName: string, workId: string }, withdraw: string },
    see_more_artists:{ artistId: { userName: string, artistId: string }, watch: string },
    see_more_works: { workId: { workName: string, workId: string }, like: string },
    view_user: { userId: { userName: string, userId: string }, ban?: string },
    view_artist: { artistId: { userName: string, artistId: string }, watch: string },
    view_works_of_artists:{ workId: { workName: string, workId: string }, like: string },
    view_work: { workId: { workName: string, workId: string }, like: string },
    ban_watcher: { id:string, userArtistId: string,time: string,key_: string, value:string },
    watch_artist:  { userArtistId: string, userId:string, artistId:string, creationTime: string },
    rewatch_artist:  { id:string, userArtistId: string,time: string,key_: string, value:string },
    unwatch_artist:  { id:string, userArtistId: string,time: string,key_: string, value:string },
    like_work: {id:string, userWorkId: string,time: string,key_: string, value:string },
    unlike_work: { id:string, userWorkId: string,time: string,key_: string, value:string },
    delete_ : {id:string, userId: string,time: string,key_: string, value:string},
    insert_into_requests_logs: { id: string, time_: string, route: string, methods: Array<string> },
    insert_into_responses_logs:  { id: string, time_: string, requestId: string, statusCode: string },
    insert_into_errors_logs:  { id: string, time_: string, requestId: string, message: string  },
    select_full_logs: { requestId: string, time_: string, route: string, methods: Array<string>, errorId: string, errorTime: string, message: string, responseId: string, responseTime: string, statusCode: string }
}

declare type Controler =((req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void);

declare interface ControlerCallbacks {
    reqParamsHandler: (req: Response) => ProcedureProps;
    dbHandler?: (props: ProcedureProp) => Promise<OneMore<QueryResult<any>>>;
    propsBuilder: (r: OneMore<QueryResult<any>>) => RenderableProps;
    outputCallback: (res: Response, props: RenderableProps) => void;
}

declare function buildControler(cbs: ControlerCallbacks): Controler;

declare type ProcedureProps = Record<UbiquitousConcept, string>;

declare function requestParamsHandlerSourcer(
    req: Response,
    c: UbiquitousConcept,
    s: Source
): string;

declare function requestParamsHandlerBuilder(
    sourcer: (req: Response, c: UbiquitousConcept, s: Source) => string,
    concepts: Record<UbiquitousConcept, Source>
);
declare type Source = "unit" | "route" | "session" | "body" | "params";

declare interface DBHandlerParams {
    pool: Pool;
    procedures: Array<DBProcedure>;
}

declare function DataPropsBuilderGenerator(): (
    r: OneMore<QueryResult<any>>
) => DataRenderableProps;
declare function UrlPropsBuilderConstantGenerator(
    url: string
): (r: OneMore<QueryResult<any>>) => UrlRenderableProps;

declare interface propsBuilderParams {
    pool: Pool;
    renderable: Renderable;
}

declare function outputCallbackGenerator(
    renderable: Renderable
): (res: Response, props: RenderableProps) => void;

declare interface CellProps {
    value: any;
    link?: string,
}

export type {
    CellProps,
    RouteEvent,
    UbiquitousConcept,
    DBProcedure,
    DBProcedureArgsMappingType,
    DBProcedureResultsMappingType,
    EjsView,
    EjsViewPropsMappingType,
    Redirection,
    RedirectionArgsMappingType,
    RoutePath,
    RoutePathParams,
    RouteData,
    Controler,
    Verb
}
