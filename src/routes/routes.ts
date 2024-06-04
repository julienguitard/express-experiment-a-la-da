import {RoutePath,RoutePathParams,RoutesData} from "../types"

import {
  consoleControler,
  sessionFirstUpdateControler,
  logToPostgresControler,
  showLogsControler,
  showLogsTableControler,
  mockSessionControler,
} from "../middlewares/index.js";

import {
  buildControler,
  buildParametrizedControler,
} from "../middlewares/factory.js";



const routesParams:any = {
  "/": {
    render: "./static/Index",
  },
  "/landing/signin": {
    render: "./static/Signin",
  },
  "/landing/signup": {
    render: "./static/Signup",
  },
  "/landing/signin/submit": {
    redirect: "/home",
  },
  "/landing/signup/submit": {
    redirect: "/home",
  },
  "/home": {
    render: "./static/ArtistHome",
  },
  "/profile/works/work": {
    render: "./static/Work",
  },
  "/profile/artists/artist": {
    render: "./static/Artist",
  },
  "/profile/users/user/ban": {
    redirect: "/home",
  },
  "/profile/artists/artist/unwatch": {
    redirect: "/home",
  },
  "/profile/works/work/unlike": {
    redirect: "/home",
  },
  "/home/users/more": {
    render: "./static/MoreUsers",
  },
  "/home/artists/more": {
    render: "./static/MoreArtists",
  },
  "/home/works/more": {
    render: "./static/MoreWorks",
  },
  "/signout": {
    render: "./static/Signout",
  },
  "/signout/submit": {
    redirect: "/",
  },
  "/delete": {
    render: "./static/Delete",
  },
  "/delete/submit": {
    redirect: "/",
  },
};

const parametrizedRoutesParams: RoutePathParams = {
  "/parametrized": {
    render: "Index",
  },
  "/parametrized/landing/signin": {
    render: "Signin",
  },
  "/parametrized/landing/signup": {
    render: "Signup",
  },
  "/parametrized/landing/signin/submit": {
    redirect: "/parametrized/home", method: "post"
  },
  "/parametrized/landing/signup/submit": {
    redirect: "/parametrized/home", method: "post"
  },
  "/parametrized/home": {
    render: "ArtistHome",
  },
  "/parametrized/profile/works/work/:workId": {
    render: "Work",
  },
  "/parametrized/profile/artists/artist/:artistId": {
    render: "Artist",
  },
  "/parametrized/profile/artists/user/:userId": {
    render: "User",
  },
  "/parametrized/profile/users/user/:userId/ban": {
    redirect: "/parametrized/home", method: "post"
  },
  "/parametrized/profile/artists/artist/:artistId/unwatch": {
    redirect: "/parametrized/home", method: "post"
  },
  "/parametrized/profile/works/work/:workId/unlike": {
    redirect: "/parametrized/home", method: "post"
  },
  "/parametrized/home/users/more": {
    render: "MoreUsers",
  },
  "/parametrized/home/artists/more": {
    render: "MoreArtists",
  },
  "/parametrized/home/works/more": {
    render: "MoreWorks",
  },
  "/parametrized/home/works/submit": {
    render: "Submit",
  },
  "/parametrized/home/works/submit/submit": {
    render: "home", method: "post"
  },
  "/parametrized/signout": {
    render: "Signout",
  },
  "/parametrized/signout/submit": {
    redirect: "/parametrized", method: "post"
  },
  "/parametrized/delete": {
    render: "Delete",
  },
  "/parametrized/delete/submit": {
    redirect: "/parametrized", method: "post"
  },
};

const routes:any = Object.entries(routesParams).map(([k, v]) => {
  return {
    route: k,
    method:  "get" ,
    controlers: [
      consoleControler,
      sessionFirstUpdateControler,
      logToPostgresControler,
      buildControler(v),
    ],
  };
});

const parametrizedRoutes:RoutesData = Object.entries(parametrizedRoutesParams).map(
  ([k, v]) => {
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
);


console.log(Object.entries(parametrizedRoutesParams).filter(kv=>kv[1].render).map(kv=>kv[1].render).join(':{},\n'));

export { routes, parametrizedRoutes };
