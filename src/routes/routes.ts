import {RoutePathParams,RouteData, DBProcedure, EjsView, RoutePath, Verb, RouteEvent} from "../types"

import {
  consoleControler,
  sessionFirstUpdateControler,
  logToPostgresControler,
} from "../middlewares/index.js";

import {
  buildControler,
  builder,
  buildParametrizedControler,
} from "../middlewares/factory.js";

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
  "/home/users/more": {dbProcedures:['see_more_users']},
  "/home/artists/more": {dbProcedures:['see_more_artists']},
  "/home/works/more": {dbProcedures:['see_more_works']},
  "/home/works/like/more": {dbProcedures:['see_more_liked_works']},
  "/profile/users/user/:userId": {dbProcedures:['view_user']},
  "/profile/artists/artist/:artistId": {dbProcedures:['view_artist', 'view_works_of_artist']},
  "/profile/works/work/:workId/view": {dbProcedures:['go_view_work'],event:'view'},
  "/profile/works/work/:userWorkId/review": {dbProcedures:['go_review_work'],event:'view'},
  "/profile/works/work/:workId": {dbProcedures:['view_work']},
  "/profile/users/user/:userArtistId/ban": {dbProcedures:[]},
  "/profile/users/user/:userArtistId/ban/submit": {dbProcedures:['ban_watcher'],redirect: "/home", method: "post",event:'ban'},
  "/profile/artists/artist/:artistId/watch": {dbProcedures:['watch_artist'],event:'watch'},
  "/profile/artists/artist/:userArtistId/rewatch": {dbProcedures:['rewatch_artist'],event:'watch'},
  "/profile/artists/artist/:userArtistId/unwatch": {dbProcedures:['unwatch_artist'],event:'unwatch'},
  "/profile/works/work/:userWorkId/like": {dbProcedures:['like_work'],event:'like'},
  "/profile/works/work/:userWorkId/unlike": {dbProcedures:['unlike_work'],event:'unlike'},
  "/signout": {dbProcedures:[]},
  "/signout/submit": {dbProcedures:[],redirect: "/home", method: "post"},
  "/delete": {dbProcedures:[]},
  "/delete/submit": {dbProcedures:['delete_'],redirect: "/home", method: "post",event:'delete'}
}

const routesParams: RoutePathParams = {
  "/": {
    render: "Index"
  },
  "/landing/signin": {
    render: "Signin"
  },
  "/landing/signup": {
    render: "Signup"
  },
  "/landing/signin/submit": {
    redirect: "/home", method: "post"
  },
  "/landing/signup/submit": {
    redirect: "/home", method: "post"
  },
  "/home": {
    render: "ArtistHome"
  },
    "/home/users/more": {
      render: "MoreUsers"
    },
    "/home/works/more": {
      render: "MoreWorks"
    },
    "/home/artists/more": {
      render: "MoreArtists"
    },
    "/home/works/like/more": {
      render: "MoreWorks"
    },
    "/home/works/firstSubmit": {
      render: "Submit"
    },
    "/home/works/firstSubmit/submit": {
      redirect: "/home", method: "post"
    },
    "/home/works/submit": {
      render: "Submit"
    },
    "/home/works/submit/submit": {
      redirect: "/home", method: "post"
    },
    "/profile/users/user/:userId": {
      render: "User",
    },
    "/profile/artists/artist/:artistId": {
      render: "Artist",
    },
    "/profile/works/work/:workId/view": {
      redirect: "/profile/works/work/:workId", method:"post"
    },
    "/profile/works/work/:userWorkId/review": {
      redirect: "/profile/works/work/:workId", method:"post"
    },
  "/profile/works/work/:workId": {
    render: "Work"
  },
  "/profile/users/user/:userArtistId/ban": {
    render: "Ban"
  },
  "/profile/users/user/:userArtistId/ban/submit": {
    redirect: "/home", method: "post"
  },
  "/profile/artists/artist/:artistId/watch": {
    redirect: "/home", method: "post"
  },
  "/profile/artists/artist/:userArtistId/unwatch": {
    redirect: "/home", method: "post"
  },
  "/profile/artists/artist/:userArtistId/rewatch": {
    redirect: "/home", method: "post"
  },
  "/profile/works/work/:userWorkId/like": {
    redirect: "/home", method: "post"
  },
  "/profile/works/work/:userWorkId/unlike": {
    redirect: "/home", method: "post"
  },
  "/signout": {
    render: "Signout",
  },
  "/signout/submit": {
    redirect: "/", method: "post"
  },
  "/delete": {
    render: "Delete",
  },
  "/delete/submit": {
    redirect: "/", method: "post"
  },
};



const routes:Array<RouteData> = Object.entries(routesParams).map(
  ([k, v],i) => {
    if(i<5){
      console.log('Get into builder')
      return  {
        route: k,
        method: (v.method === undefined) ? "get" : v.method,
        controlers: [
          consoleControler,
          sessionFirstUpdateControler,
          logToPostgresControler,
          builder(k),
        ],
      };
    }
    else {
      return {
        route: k,
        method: (v.method === undefined) ? "get" : v.method,
        controlers: [
          consoleControler,
          sessionFirstUpdateControler,
          logToPostgresControler,
          buildParametrizedControler(v),
        ],
      };
    }
    }
    
);


export { routes };
