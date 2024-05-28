import { logToPostgresControler,renderControler, showLogsControler, showLogsTableControler,mockSessionControler } from '../middlewares/index.js';

import { buildMockControler, buildParametrizedMockControler } from "../middlewares/factory.js";

const routes: Array<{
  route: string; method: string; procedure?: undefined; controlers: Array<Function>;
}> = [
    {
      route: "/",
      method: "get",
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/landing/signin/",
      method: "get",
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/landing/signup/submit",
      method: "post",
      procedure: undefined,
      controlers: [renderControler],
    },
    {
      route: "/landing/signup/",
      method: "get",
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/landing/signup/submit",
      method: "post",
      procedure: undefined,
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/home",
      method: "get",
      procedure: undefined,
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/home/artists",
      method: "get",
      procedure: undefined,
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/home/artists/more",
      method: "get",
      procedure: undefined,
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/home/works",
      method: "get",
      procedure: undefined,
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/home/works/more",
      method: "get",
      procedure: undefined,
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/home/works/myworks",
      method: "get",
      procedure: undefined,
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/home/works/mywatcher",
      method: "get",
      procedure: undefined,
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/home/works/myworks/submit",
      method: "post",
      procedure: undefined,
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/home/works/myworks/:work/withdraw",
      method: "post",
      procedure: undefined,
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/home/profile/users/:user/ban",
      method: "post",
      procedure: undefined,
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/home/profile/artists/:artist",
      method: "get",
      procedure: undefined,
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/home/profile/artists/:artist/watch",
      method: "post",
      procedure: undefined,
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/home/profile/artists/:artist/unwatch",
      method: "post",
      procedure: undefined,
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/home/profile/works/:work",
      method: "get",
      procedure: undefined,
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/home/profile/works/:artist/like",
      method: "post",
      procedure: undefined,
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/home/profile/artists/:artist/unlike",
      method: "post",
      procedure: undefined,
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/home/logout",
      method: "post",
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/home/delete",
      method: "post",
      procedure: undefined,
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/admin",
      method: "get",
      procedure: undefined,
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/admin/logs",
      method: "get",
      procedure: undefined,
      controlers: [logToPostgresControler, showLogsTableControler],
    },
    {
      route: "/api/logs",
      method: "get",
      procedure: undefined,
      controlers: [logToPostgresControler, showLogsControler],
    },
    {
      route: "/users",
      method: "get",
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/artists",
      method: "get",
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/works",
      method: "get",
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/artists/watch",
      method: "post",
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/works/like",
      method: "post",
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/artists/unwatch",
      method: "post",
      controlers: [logToPostgresControler, renderControler],
    },
    {
      route: "/works/unlike",
      method: "post",
      controlers: [logToPostgresControler, renderControler],
    },
  ];

const mockRoutesParams = {
  "/mock": {
    render: "./static/Index",
  },
  "/mock/landing/signin": {
    render: "./static/Signin"
  },
  "/mock/landing/signup": {
    render: "./static/Signup"
  },
  "/mock/landing/signin/submit": {
    redirect: "/mock/home"
  },
  "/mock/landing/signup/submit": {
    redirect: "/mock/home"
  },
  "/mock/home": {
    render: "./static/ArtistHome"
  },
  "/mock/profile/works/work": {
    render: "./static/Work"
  },
  "/mock/profile/artists/artist": {
    render: "./static/Artist"
  },
  "/mock/profile/users/user/ban": {
    redirect: "/mock/home"
  },
  "/mock/profile/artists/artist/unwatch": {
    redirect: "/mock/home"
  },
  "/mock/profile/works/work/unlike": {
    redirect: "/mock/home"
  },
  "/mock/home/users/more": {
    render: "./static/MoreUsers"
  },
  "/mock/home/artists/more": {
    render: "./static/MoreArtists"
  },
  "/mock/home/works/more": {
    render: "./static/MoreWorks"
  },
  "/mock/signout": {
    render: "./static/Signout"
  },
  "/mock/signout/submit": {
    redirect: "/mock"
  },
  "/mock/delete": {
    render: "./static/Delete"
  },
  "/mock/delete/submit": {
    redirect: "/mock"
  }
};

const mockParametrizedRoutesParams = {
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
  "/parametrized/profile/works/work": {
    render: "./parametrized/Work"
  },
  "/parametrized/profile/artists/artist": {
    render: "./parametrized/Artist"
  },
  "/parametrized/profile/users/user/ban": {
    redirect: "/parametrized/home"
  },
  "/parametrized/profile/artists/artist/unwatch": {
    redirect: "/parametrized/home"
  },
  "/parametrized/profile/works/work/unlike": {
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



const mockRoutes = Object.entries(mockRoutesParams).map(
  ([k,v]) => {return {
     route: k,
     method: 'get',
     controlers:[logToPostgresControler, buildMockControler(v)]
   }}
);

const mockParametrizedRoutes = Object.entries(mockParametrizedRoutesParams).map(
  ([k,v]) => {return {
     route: k,
     method: 'get',
     controlers:[logToPostgresControler, mockSessionControler, buildParametrizedMockControler(v)]
   }}
)

export {routes, mockRoutes,mockParametrizedRoutes};