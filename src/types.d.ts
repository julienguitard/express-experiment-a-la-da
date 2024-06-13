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
    time: string,
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
    insert_user: { userId: string , time: string , userName: string ,  pwd: string },
    insert_user_event: { userId: string, time: string,key_: string },
    insert_artist: { artistId: string,time: string,userId: string },
    insert_artist_event: { artistId: string , time: string , key_: string },
    insert_work:{ workId: string , artistId: string , time: string , workName: string },
    insert_work_event: { workId: string,time: string,key_: string },
    insert_user_artist: { userArtistId: string , userId: string , artistId: string , time: string },
    insert_user_artist_event:{ userArtistId: string , time: string , key_: string },
    insert_user_work: { userWorkId: string ,  userId: string , workId: string , time: string },
    insert_user_work_event:{ userWorkId: string ,  time: string , key_: string },
    check_signin:{ userName: string,pwd: string },
    check_signup: { userName: string , pwd: string ,  confirmedPwd: string },
    see_watchers:{ artistId: string },
    see_more_users:{ artistId: string },
    see_works:{ artistId: string },
    see_more_liked_works: { artistId: string },
    see_watched_artists: { userId: string },
    see_more_artists:{ userId: string },
    see_liked_works: { userId: string },
    see_more_liked_works:{ userId: string },
    view_user:{ artistId: string,userId: string },
    view_artist:{ artistId: string,userId: string },
    view_works_of_artist:{ artistId: string,userId: string },
    view_work:{ userId: string,workId: string },
    ban_watcher:{ artistId: string,userId: string },
    submit_work: { artistId: string,workName: string },
    submit_first_work: { userId: string,workName: string },
    withdraw_work: {workId: string },
    watch_artist:{ userId: string,artistId: string },
    rewatch_artist:{ userArtistId: string},
    unwatch_artist: { userId: string,artistId: string },
    go_view_work:{ userId: string,workId: string };
    go_review_work:{ userWorkdId: string },
    like_work:{ userId: string,workId: string },
    unlike_work:{ userId: string,workId: string },
    signout:{ userId: string,userName: string ,artistId?:string},
    delete_:{ userId: string,userName: string ,artistId?:string},
    insert_into_requests_logs: { time: string , path: string , methods: Array<string> },
    insert_into_responses_logs: { time: string , path: string , methods: Array<string> ,  error: Error },
    insert_into_errors_logs:{ time: string , path: string , methods: Array<string> , error: Error },
    select_full_logs: {},
}

declare type DBProcedureResultsMappingType = {
    insert_user: { userId: string , time: string , userName: string ,  pwd: string },
    insert_user_event: { userId: string,time: string,key_: string },
    insert_artist: { artistId: string,time: string,userId: string },
    insert_artist_event: { artistId: string , time: string , key_: string },
    insert_work:{ workId: string , artistId: string , time: string , workName: string },
    insert_work_event: { workId: string,time: string,key_: string },
    insert_user_artist: { userArtistId: string , userId: string , artistId: string , time: string },
    insert_user_artist_event:{ userArtistId: string , time: string , key_: string },
    insert_user_work: { userWorkId: string ,  userId: string , workId: string , time: string },
    insert_user_work_event:{ userWorkId: string ,  time: string , key_: string },
    check_signin: { userId: string,userName: string,artistId?: string},
    check_signup: { userId: string,userName: string },
    see_watchers: { userId: { userName: string, userId: string }, ban: string },
    see_more_users: { userId: { userName: string, userId: string } },
    see_works: { workId: { workName: string, workId: string }, withdraw: string },
    see_more_liked_works: { workId: { workName: string, workId: string }, withdraw: string },
    see_watched_artists: { artistId: { userName: string, artistId: string }, unwatch: string },
    see_more_artists:{ artistId: { userName: string, artistId: string }, watch: string },
    see_liked_works: { workId: { workName: string, workId: string }, unlike: string },
    see_more_works: { workId: { workName: string, workId: string }, like: string },
    view_user: { userId: { userName: string, userId: string }, ban?: string },
    view_artist: { artistId: { userName: string, artistId: string }, watch: string },
    view_works_of_artists:{ workId: { workName: string, workId: string }, like: string },
    view_work: { workId: { workName: string, workId: string }, like: string },
    ban_watcher: { userId: { userName: string, userId: string }, ban: string },
    submit_work: { workId: string },
    withdraw_work: { workId: string },
    submit_first_work: { artistId: string,workId: string },
    watch_artist: { artistId: string },
    unwatch_artist: { artistId: string },
    like_work: { workId: string },
    unlike_work: { workId: string },
    insert_into_requests_logs: { requestId: string , time: string , path: string , methods: Array<string> },
    insert_into_responses_logs:  { reponseId: string , time: string , requestId: string , status: string },
    insert_into_errors_logs:  { errorId: string , time: string , requestId: string , message: string },
    select_full_logs: { requestId: string , time: string , path: string , methods: Array<string> , errorId: string , time: string , message: string , reponseId: string , time: string , status: string }
}

declare type Controler =
    (
        req: Request,
        res: Response,
        next: NextFunction
    ) => void;

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
    Controler
}
