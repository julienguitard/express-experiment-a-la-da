import { consoleControler, sessionFirstUpdateControler, logToPostgresControler,renderControler, showLogsControler, showLogsTableControler,mockSessionControler } from '../middlewares/index.js';

import { buildControler, buildParametrizedControler } from "../middlewares/factory.js";

const routesParams = {
  "/": {
    render: "./static/Index",
  },
  "/landing/signin": {
    render: "./static/Signin"
  },
  "/landing/signup": {
    render: "./static/Signup"
  },
  "/landing/signin/submit": {
    redirect: "/home"
  },
  "/landing/signup/submit": {
    redirect: "/home"
  },
  "/home": {
    render: "./static/ArtistHome"
  },
  "/profile/works/work": {
    render: "./static/Work"
  },
  "/profile/artists/artist": {
    render: "./static/Artist"
  },
  "/profile/users/user/ban": {
    redirect: "/home"
  },
  "/profile/artists/artist/unwatch": {
    redirect: "/home"
  },
  "/profile/works/work/unlike": {
    redirect: "/home"
  },
  "/home/users/more": {
    render: "./static/MoreUsers"
  },
  "/home/artists/more": {
    render: "./static/MoreArtists"
  },
  "/home/works/more": {
    render: "./static/MoreWorks"
  },
  "/signout": {
    render: "./static/Signout"
  },
  "/signout/submit": {
    redirect: "/"
  },
  "/delete": {
    render: "./static/Delete"
  },
  "/delete/submit": {
    redirect: "/"
  }
};

const parametrizedRoutesParams = {
  "/parametrized": {
    render: "./parametrized/Index",
  },
  "/parametrized/landing/signin": {
    render: "./parametrized/Signin"
  },
  "/parametrized/landing/signup": {
    render: "./parametrized/Signup"
  },
  "/parametrized/landing/signin/submit": {
    redirect: "/parametrized/home"
  },
  "/parametrized/landing/signup/submit": {
    redirect: "/parametrized/home"
  },
  "/parametrized/home": {
    render: "./parametrized/ArtistHome"
  },
  "/parametrized/profile/works/work:workId": {
    render: "./parametrized/Work"
  },
  "/parametrized/profile/artists/artist:artistId": {
    render: "./parametrized/Artist"
  },
  "/parametrized/profile/artists/user:userId": {
    render: "./parametrized/Artist"
  },
  "/parametrized/profile/users/user:userId/ban": {
    redirect: "/parametrized/home"
  },
  "/parametrized/profile/artists/artist:artistId/unwatch": {
    redirect: "/parametrized/home"
  },
  "/parametrized/profile/works/work:workId/unlike": {
    redirect: "/parametrized/home"
  },
  "/parametrized/home/users/more": {
    render: "./parametrized/MoreUsers"
  },
  "/parametrized/home/artists/more": {
    render: "./parametrized/MoreArtists"
  },
  "/parametrized/home/works/more": {
    render: "./parametrized/MoreWorks"
  },
  "/parametrized/home/works/submit": {
    render: "./parametrized/NewWork"
  },
  "/parametrized/home/works/submit/submit": {
    render: "./parametrized/home"
  },
  "/parametrized/signout": {
    render: "./parametrized/Signout"
  },
  "/parametrized/signout/submit": {
    redirect: "/parametrized"
  },
  "/parametrized/delete": {
    render: "./parametrized/Delete"
  },
  "/parametrized/delete/submit": {
    redirect: "/parametrized"
  }
};

const routes = Object.entries(routesParams).map(
  ([k,v]) => {return {
     route: k,
     method: 'get',
     controlers:[consoleControler ,logToPostgresControler, buildControler(v)]
   }}
);

const parametrizedRoutes = Object.entries(parametrizedRoutesParams).map(
  ([k,v]) => {return {
     route: k,
     method: 'get',
     controlers:[consoleControler, sessionFirstUpdateControler,logToPostgresControler, mockSessionControler, buildParametrizedControler(v)]
   }}
)

export { routes,parametrizedRoutes};