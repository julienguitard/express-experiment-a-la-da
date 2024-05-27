import { logToPostgresControler,renderControler, showLogsControler, showLogsTableControler } from '../middlewares/index.js';

import { buildMockControler } from "../middlewares/factory.js";

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
    redirect: "/mock/home"
  },
  "/mock/home/artists/more": {
    redirect: "/mock/home"
  },
  "/mock/home/works/more": {
    redirect: "/mock/home"
  },
  "/mock/signout": {
    render: "/static/Signout"
  },
  "/mock/signout/submit": {
    redirect: "/mock"
  },
  "/mock/delete": {
    render: "/static/Delete"
  },
  "/mock/delete/submit": {
    redirect: "/mock"
  }
};





const mockRoutes = Object.entries(mockRoutesParams).map(
  ([k,v]) => {return {
     route: k,
     method: 'get',
     controlers:[logToPostgresControler, buildMockControler(v)]
   }}
);

export { routes, mockRoutes };