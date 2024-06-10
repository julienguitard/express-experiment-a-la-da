import {RoutePathParams,RouteData} from "../types"

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


const routesParams: RoutePathParams = {
  "/": {
    render: "Index",
  },
  "/landing/signin": {
    render: "Signin",
  },
  "/landing/signup": {
    render: "Signup",
  },
  "/landing/signin/submit": {
    redirect: "/home", method: "post"
  },
  "/landing/signup/submit": {
    redirect: "/home", method: "post"
  },
  "/home": {
    render: "ArtistHome",
  },
  "/profile/works/work/:workId": {
    render: "Work",
  },
  "/profile/artists/artist/:artistId": {
    render: "Artist",
  },
  "/profile/users/user/:userId": {
    render: "User",
  },
  "/profile/users/user/:userWorkId/ban": {
    render: "Ban"
  },
  "/profile/users/user/:userWorkId/ban/submit": {
    redirect: "/home", method: "post"
  },
  "/profile/artists/artist/:artistId/watch": {
    redirect: "/home", method: "post"
  },
  "/profile/artists/artist/:userArtistId/watch": {
    redirect: "/home", method: "post"
  },
  "/profile/artists/artist/:userArtistId/unwatch": {
    redirect: "/home", method: "post"
  },
  "/profile/works/work/:workId/like": {
    redirect: "/home", method: "post"
  },
  "/profile/works/work/:userWorkId/like": {
    redirect: "/home", method: "post"
  },
  "/profile/works/work/:userWorkId/unlike": {
    redirect: "/home", method: "post"
  },
  "/home/users/more": {
    render: "MoreUsers",
  },
  "/home/artists/more": {
    render: "MoreArtists",
  },
  "/home/works/more": {
    render: "MoreWorks",
  },
  "/home/works/submit": {
    render: "Submit",
  },
  "/home/works/submit/submit": {
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
