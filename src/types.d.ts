import { Request, Reponse, Error, NextFunction } from "express";
import { Pool, QueryResult } from "pg";
import { Session, SessionData } from "./express-session";

declare type RoutePath =
    | "/"
    | "/landing/signin"
    | "/landing/signup"
    | "/landing/signin/submit"
    | "/landing/signup/submit"
    | "/home"
    | "/home/artists/more"
    | "/home/works/more"
    | "/home/works/firstSubmit"
    | "/home/works/firstSubmit/submit"
    | "/home/works/submit"
    | "/home/works/submit/submit"
    | "/profile/works/work/:artistId/:workId/withdraw"
    | "/profile/works/work/:artistId/:workId/withdraw/submit"
    | "/profile/users/user/:userId"
    | "/profile/artists/artist/:artistId"
    | "/profile/works/work/:workId"
    | "/profile/users/user/:artistId/:userArtistId/ban"
    | "/profile/users/user/:artistId/:userArtistId/ban/submit"
    | "/profile/artists/artist/:userId/:userArtistId/watch"
    | "/profile/artists/artist/:userId/:userArtistId/unwatch"
    | "/profile/works/work/:userId/:userWorkId/like"
    | "/profile/works/work/:userId/:userWorkId/unlike"
    | "/signout"
    | "/signout/submit"
    | "/delete"
    | "/delete/submit";

declare type Redirection = keyof RedirectionArgsMappingType;

declare type RedirectionArgsMappingType = {
    "/home": {},
    "/": {}
}

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
    see_more_artists:{ userId: string },//TO DO
    see_more_works:{ userId: string },//TO DO
    view_user:{ artistId: string,userId: string },//TO DO
    view_artist:{ userArtistId: string,userId: string,artistId: string,reqEpoch: string},//TO DO
    view_works_of_artist:{ artistId: string },//TO DO
    view_work:{userWorkId: string,userId: string,workId: string,reqEpoch: string},
    ban_watcher:{ userArtistId: string,reqEpoch:string},
    watch_artist:{ userArtistId: string,reqEpoch:string},
    unwatch_artist: { userArtistId: string,reqEpoch:string},
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
    see_more_works: { workId: { workName: string, workId: string }, withdraw: string },
    see_more_artists:{ artistId: { userName: string, artistId: string }, watch: string },
    view_user: { userId: { userName: string, userId: string }, ban?: string },
    view_artist: { artistId: { userName: string, artistId: string }, watch: string },
    view_works_of_artists:{ workId: { workName: string, workId: string }, like: string },
    view_work: { workId: { workName: string, workId: string }, like: string },
    ban_watcher: { id:string, userArtistId: string,time: string,key_: string, value:string },
    watch_artist:  { userArtistId: string, userId:string, artistId:string, creationTime: string },
    unwatch_artist:  { id:string, userArtistId: string,time: string,key_: string, value:string },
    like_work: {id:string, userWorkId: string,time: string,key_: string, value:string },
    unlike_work: { id:string, userWorkId: string,time: string,key_: string, value:string },
    delete_ : {id:string, userId: string,time: string,key_: string, value:string},
    insert_into_requests_logs: { id: string, time_: string, route: string, methods: Array<string> },
    insert_into_responses_logs:  { id: string, time_: string, requestId: string, statusCode: string },
    insert_into_errors_logs:  { id: string, time_: string, requestId: string, message: string  },
    select_full_logs: { requestId: string, time_: string, route: string, methods: Array<string>, errorId: string, errorTime: string, message: string, responseId: string, responseTime: string, statusCode: string }
}

declare type Verb = 'get' | 'post'
declare type RoutePathLevelData = {
    dbProcedures: Array<DBProcedure>,
    redirect?:RoutePath,
    render?:EjsView,
    method?:Verb,
    fallback?:RoutePath}

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
    FirstSubmit: { userName: string, startTime: string },
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
    MoreArtists: Array<{
        artistId: { userName: string, artistId: string },
        watch: string,
    }>,
    MoreWorks: Array<{
        workId: { workName: string, workId: string },
        artistId: { userName: string, artistId: string },
    }>,
}

declare type Controler = (
    (
        req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, 
        res: Response<any,Record<string, any>>, 
        next: NextFunction
        ) => void);

export type {
    DBProcedure,
    DBProcedureArgsMappingType,
    DBProcedureResultsMappingType,
    EjsView,
    EjsViewPropsMappingType,
    Redirection,
    RedirectionArgsMappingType,
    RoutePath,
    RoutePathLevelData,
    RouteData,
    Controler,
    Verb
}
