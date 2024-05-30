import { logToPostgresControler,renderControler, showLogsControler, showLogsTableControler,mockSessionControler } from '../middlewares/index.js';

import { buildMockControler, buildParametrizedMockControler } from "../middlewares/factory.js";

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

export { mockRoutes,mockParametrizedRoutes};