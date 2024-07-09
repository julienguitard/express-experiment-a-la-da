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
    "/home": {};
    "/": {};
};

declare type DBProcedure =
    | keyof DBProcedureArgsMappingType
    | keyof DBProcedureResultsMappingType;

declare type DBProcedureArgsMappingType = {
    insert_user: {
        userId: string;
        reqEpoch: string;
        userName: string;
        pwd: string;
    };
    insert_user_event: { userId: string; reqEpoch: string; key_: string };
    insert_artist: { artistId: string; userId: string; reqEpoch: string };
    insert_artist_event: { artistId: string; reqEpoch: string; key_: string };
    insert_work: {
        workId: string;
        artistId: string;
        reqEpoch: string;
        workName: string;
    };
    insert_work_event: { workId: string; reqEpoch: string; key_: string };
    insert_user_artist: {
        userArtistId: string;
        userId: string;
        artistId: string;
        reqEpoch: string;
    };
    insert_user_artist_event: {
        userArtistId: string;
        reqEpoch: string;
        key_: string;
    };
    insert_user_work: {
        userWorkId: string;
        userId: string;
        workId: string;
        reqEpoch: string;
    };
    insert_user_work_event: {
        userWorkId: string;
        reqEpoch: string;
        key_: string;
    };
    check_signin: { userName: string; pwd: string };
    check_signup: {
        userId: string;
        reqEpoch: string;
        userName: string;
        pwd: string;
    };
    see_watchers: { artistId: string };
    see_works: { artistId: string };
    see_watched_artists: { userId: string };
    see_liked_works: { userId: string };
    submit_first_work: {
        workId: string;
        artistId: string;
        user_id: string;
        reqEpoch: string;
        workName: string;
    };
    submit_work: {
        workId: string;
        artistId: string;
        reqEpoch: string;
        workName: string;
    };
    withdraw_work: { workId: string; reqEpoch: string };
    see_more_artists: { userId: string }; //TO DO
    see_more_works: { userId: string }; //TO DO
    view_user: { artistId: string; userId: string }; //TO DO
    view_artist: {
        userArtistId: string;
        userId: string;
        artistId: string;
        reqEpoch: string;
    }; //TO DO
    view_works_of_artist: { artistId: string }; //TO DO
    view_work: {
        userWorkId: string;
        userId: string;
        workId: string;
        reqEpoch: string;
    };
    ban_watcher: { userArtistId: string; reqEpoch: string };
    watch_artist: { userArtistId: string; reqEpoch: string };
    unwatch_artist: { userArtistId: string; reqEpoch: string };
    like_work: { userWorkId: string; reqEpoch: string };
    unlike_work: { userWorkId: string; reqEpoch: string };
    delete_: { userId: string; reqEpoch: string };
    insert_into_requests_logs: {
        reqEpoch: string;
        time_: string;
        route: string;
        methods: Array<string>;
    };
    insert_into_responses_logs: {
        reqEpoch: string;
        time_: string;
        route: string;
        statusCode: string;
    };
    insert_into_errors_logs: {
        reqEpoch: string;
        time_: string;
        route: string;
        message: string;
    };
    select_full_logs: {};
};

declare type DBProcedureResultsMappingType = {
    insert_user: {
        id: string;
        pwd: string;
        user_name: string;
        creation_time: string;
    };
    insert_user_event: {
        id: string;
        key_: string;
        _time: string;
        value: string;
        user_id: string;
    };
    insert_artist: { id: string; user_id: string; creation_time: string };
    insert_artist_event: {
        id: string;
        key_: string;
        _time: string;
        value: string;
        artist_id: string;
    };
    insert_work: {
        id: string;
        artist_id: string;
        work_name: string;
        creation_time: string;
    };
    insert_work_event: {
        id: string;
        key_: string;
        _time: string;
        value: string;
        work_id: string;
    };
    insert_user_artist: {
        id: string;
        user_id: string;
        artist_id: string;
        creation_time: string;
    };
    insert_user_artist_event: {
        id: string;
        key_: string;
        _time: string;
        value: string;
        user_artist_id: string;
    };
    insert_user_work: {
        id: string;
        user_id: string;
        work_id: string;
        creation_time: string;
    };
    insert_user_work_event: {
        id: string;
        key_: string;
        _time: string;
        value: string;
        user_work_id: string;
    };
    check_signin: { user_id: string; artist_id: string; user_name: string };
    check_signup: { user_id: string; user_name: string };
    see_watchers: { ban: Record<string, string>; user_: Record<string, string> };
    see_works: {
        work_: Record<string, string>;
        withdraw: Record<string, string>;
    };
    see_watched_artists: {
        artist: Record<string, string>;
        unwatch: Record<string, string>;
    };
    see_liked_works: {
        work_: Record<string, string>;
        unlike: Record<string, string>;
    };
    submit_first_work: {
        id: string;
        artist_id: string;
        work_name: string;
        creation_time: string;
    };
    submit_work: {
        id: string;
        artist_id: string;
        work_name: string;
        creation_time: string;
    };
    withdraw_work: {
        id: string;
        key_: string;
        _time: string;
        value: string;
        work_id: string;
    };
    see_more_artists: { artist: Record<string, string> };
    see_more_works: {
        work_: Record<string, string>;
        artist: Record<string, string>;
    };
    view_artist: {
        artist: Record<string, string>;
        action_: Record<string, string>;
    };
    view_work: {
        work_: Record<string, string>;
        artist: Record<string, string>;
        action_: Record<string, string>;
    };
    view_works_of_artist: {
        work_: Record<string, string>;
        artist: Record<string, string>;
    };
    ban_watcher: {
        id: string;
        key_: string;
        _time: string;
        value: string;
        user_artist_id: string;
    };
    watch_artist: {
        id: string;
        key_: string;
        _time: string;
        value: string;
        user_artist_id: string;
    };
    unwatch_artist: {
        id: string;
        key_: string;
        _time: string;
        value: string;
        user_artist_id: string;
    };
    like_work: {
        id: string;
        key_: string;
        _time: string;
        value: string;
        user_work_id: string;
    };
    unlike_work: {
        id: string;
        key_: string;
        _time: string;
        value: string;
        user_work_id: string;
    };
    delete_: {
        id: string;
        key_: string;
        _time: string;
        value: string;
        user_id: string;
    };
    insert_stringo_requests_logs: {
        id: string;
        route: string;
        time_: string;
        methods: string;
    };
    insert_stringo_responses_logs: {
        id: string;
        time_: string;
        request_id: string;
        status_code: string;
    };
    insert_stringo_errors_logs: {
        id: string;
        time_: string;
        message: string;
        request_id: string;
    };
    select_full_logs: {
        id: string;
        route: string;
        time_: string;
        message: string;
        methods: string;
        error_id: string;
        error_time: string;
        reponse_id: string;
        status_code: string;
        response_time: string;
    };
};

declare type Verb = "get" | "post";
declare type RoutePathLevelData = {
    dbProcedures: Array<DBProcedure>;
    redirect?: RoutePath;
    render?: EjsView;
    method?: Verb;
    fallback?: RoutePath;
};

declare type RouteData = {
    route: RoutePath;
    method: Verb;
    controlers: Array<Controler>;
};

declare type EjsView = keyof EjsViewPropsMappingType;

declare type EjsViewPropsMappingType = {
    Index: {
        userName: string?;
        startTime: string;
    };
    Signin: {
        startTime: string;
    };
    Signup: {
        startTime: string;
    };
    UserHome: {
        userName: string;
        startTime: string;
        see_watched_artists: Array<{
            artist: { artist_id: string; user_name: string };
            unwatch: { user_id: string; user_artist_id: string };
        }>;
        see_liked_work: Array<{
            work_id: { work_id: string; work_name: string };
            like_: { user_id: string; user_work_id: string };
        }>;
    };
    ArtistHome: {
        userName: string;
        startTime: string;
        see_watchers: Array<{
            user_: { user_id: string; user_name: string };
            ban: { artist_id: string; user_artist_id: string };
        }>;
        see_liked_work: Array<{
            work_: { work_id: string; work_name: string };
            withdraw: { artist_id: string; work_id: string };
        }>;
        see_watched_artists: Array<{
            artist: { artist_id: string; user_name: string };
            unwatch: { user_id: string; user_artist_id: string };
        }>;
        see_liked_work: Array<{
            work_id: { work_id: string; work_name: string };
            like_: { user_id: string; user_work_id: string };
        }>;
    };
    Ban: {
        startTime: string;
        userId: string;
        params: { artist_id: string; user_artist_id: string };
    };
    MoreArtists: {
        startTime: string;
        userId: string;
        see_more_artists: Array<{
            artist: { artist_id: string; user_name: string };
        }>;
    };
    MoreWorks: Array<{
        startTime: string;
        userId: string;
        see_more_works: Array<{
            work_: { artist_id: string; user_name: string };
        }>;
    }>;
    FirstSubmit: {
        userName: string;
        startTime: string;
    };
    Submit: {
        userName: string;
        startTime: string;
    };
    Withdraw: {
        userName: string;
        startTime: string;
        params: { artist_id: string; user_artist_id: string };
    };
    Work: {
        userName: string;
        startTime: string;
        view_work:Array$<{
            work_: {work_id: string; work_name: string };
            artist: {artist_id: string; artist_name: string };
            action_:{ first_id: string; second_id: string; key_: string }
        }>
    };
    Artist: {
        userName: string;
        startTime: string;
        view_artist: Array<{
            artist: { artist_id: string; artist_name: string };
            action_: { first_id: string; second_id: string; key_: string };
        }>;
        view_works_of_artist: Array<{
            work_: { artist_id: string; user_name: string };
        }>;
    };
    Signout: { 
        startTime: string 
    };
    Delete: { 
        startTime: string 
    };
};

declare type Controler = (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
) => void;

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
    Verb,
};
