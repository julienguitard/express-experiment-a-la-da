import {RouteData, DBProcedure, EjsView, RoutePath, Verb, RouteEvent} from "../types"

import {
  consoleControler,
  sessionFirstUpdateControler,
  logToPostgresControler,
} from "../middlewares/index.js";

import {builderFromRoutePath} from "../middlewares/factory.js";
import { hash } from '../utils/hash';

const routeDBProcedureDict: Record<RoutePath, 
{dbProcedures: Array<DBProcedure>,redirect?:RoutePath,render?:EjsView,method?:Verb,event?:RouteEvent}> = {
  "/": {dbProcedures:[],render: "Index"},
  "/landing/signin": {dbProcedures:[],render: "Signin"},
  "/landing/signup": {dbProcedures:[],render: "Signup"},
  "/landing/signin/submit": {dbProcedures:['check_signin'],redirect: "/home", method: "post"},
  "/landing/signup/submit": {dbProcedures:['check_signup'],redirect: "/home", method: "post", event:'create'},
  "/home": {dbProcedures:['see_watchers','see_works','see_watched_artists','see_liked_works']},
  "/home/works/firstSubmit": {dbProcedures:[]},
  "/home/works/firstSubmit/submit": {dbProcedures:['submit_first_work'],redirect: "/home", method: "post",event:'submit'},
  "/home/works/submit": {dbProcedures:[]},
  "/home/works/submit/submit": {dbProcedures:['submit_work'],redirect: "/home", method: "post",event:'submit'},
  "/home/works/withdraw": {dbProcedures:[]},
  "/home/works/withdraw/submit": {dbProcedures:['withdraw_work'],redirect: "/home", method: "post",event:'withdraw'},
  "/home/users/more": {dbProcedures:['see_more_users']},//TO DO
  "/home/artists/more": {dbProcedures:['see_more_artists']},//TO DO
  "/home/works/more": {dbProcedures:['see_more_works']},//TO DO
  "/home/works/like/more": {dbProcedures:['see_more_liked_works']},//TO DO
  "/profile/users/user/:userId": {dbProcedures:['view_user']},//TO DO
  "/profile/artists/artist/:artistId": {dbProcedures:['view_artist', 'view_works_of_artist']},//TO DO
  "/profile/users/user/:userArtistId/ban": {dbProcedures:[]},
  "/profile/users/user/:userArtistId/ban/submit": {dbProcedures:['ban_watcher'],redirect: "/home", method: "post",event:'ban'},
  "/profile/artists/artist/:artistId/watch": {dbProcedures:['watch_artist'],event:'watch'},
  "/profile/artists/artist/:userArtistId/rewatch": {dbProcedures:['rewatch_artist'],event:'watch'},
  "/profile/artists/artist/:userArtistId/unwatch": {dbProcedures:['unwatch_artist'],event:'unwatch'},
  "/profile/works/work/:workId/view": {dbProcedures:['go_view_work'],event:'view'},//TO DO
  "/profile/works/work/:workId": {dbProcedures:['view_work']},//TO DO
  "/profile/works/work/:userWorkId/review": {dbProcedures:['go_review_work'],event:'view'},//TO DO
  "/profile/works/work/:userWorkId/like": {dbProcedures:['like_work'],event:'like'},
  "/profile/works/work/:userWorkId/unlike": {dbProcedures:['unlike_work'],event:'unlike'},
  "/signout": {dbProcedures:[]},
  "/signout/submit": {dbProcedures:[],redirect: "/home", method: "post"},
  "/delete": {dbProcedures:[]},
  "/delete/submit": {dbProcedures:['delete_'],redirect: "/home", method: "post",event:'delete'}
}


const routes:Array<RouteData> = Object.entries(routeDBProcedureDict).map(
  ([k, v],i) => {
    console.log('Get into builder')
      return  {
        route: k,
        method: (v.method === undefined) ? "get" : v.method,
        controlers: [
          consoleControler,
          sessionFirstUpdateControler,
          logToPostgresControler,
          builderFromRoutePath(k,v,hash),
        ],
      };
  }
);

console.log(routes);

export { routes };
