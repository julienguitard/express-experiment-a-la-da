import {
  RouteData,
  DBProcedure,
  EjsView,
  RoutePath,
  Verb,
  RouteEvent,
  RoutePathLevelData,
} from "../types";
import { SessionLevel } from "../express-session";
import {
  consoleControler,
  sessionFirstUpdateControler,
  logToPostgresControler,
} from "../middlewares/index.js";

import { builderFromRoutePath } from "../middlewares/factory.js";
import { hash } from "../utils/hash";

const routeDBProcedureDict: Record<
  RoutePath,
  Record<SessionLevel, RoutePathLevelData>
> = {
  "/": {
    NotSignedin: {
      dbProcedures: [],
      render: "Index",
    },
    SignedinAsUser: {
      dbProcedures: [],
      redirect: "/home",
    },
    SignedinAsArtist: {
      dbProcedures: [],
      redirect: "/home",
    },
  },
  "/landing/signin": {
    NotSignedin: {
      dbProcedures: [],
      render: "Signin",
    },
    SignedinAsUser: {
      dbProcedures: [],
      redirect: "/home",
    },
    SignedinAsArtist: {
      dbProcedures: [],
      redirect: "/home",
    },
  },
  "/landing/signup": {
    NotSignedin: {
      dbProcedures: [],
      render: "Signup",
    },
    SignedinAsUser: {
      dbProcedures: [],
      redirect: "/home",
    },
    SignedinAsArtist: {
      dbProcedures: [],
      redirect: "/home",
    },
  },
  "/landing/signin/submit": {
    NotSignedin: {
      dbProcedures: ["check_signin"],
      redirect: "/home",
      method: "post",
      fallback: "/",
    },
    SignedinAsUser: {
      dbProcedures: [],
      redirect: "/home",
    },
    SignedinAsArtist: {
      dbProcedures: [],
      redirect: "/home",
    },
  },
  "/landing/signup/submit": {
    NotSignedin: {
      dbProcedures: ["check_signup"],
      redirect: "/home",
      method: "post",
      event: "create",
      fallback: "/",
    },
    SignedinAsUser: {
      dbProcedures: [],
      redirect: "/home",
    },
    SignedinAsArtist: {
      dbProcedures: [],
      redirect: "/home",
    },
  },
  "/home": {
    NotSignedin: {
      dbProcedures: [],
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: ["see_watched_artists", "see_liked_works"],
      render: "UserHome",
      fallback: "/",
    },
    SignedinAsArtist: {
      dbProcedures: [
        "see_watchers",
        "see_works",
        "see_watched_artists",
        "see_liked_works",
      ],
      render: "ArtistHome",
      fallback: "/",
    },
  },
  "/home/works/firstSubmit": {
    NotSignedin: {
      dbProcedures: [],
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: [],
      render: "FirstSubmit",
    },
    SignedinAsArtist: {
      dbProcedures: [],
      redirect: "/home/works/submit",
    },
  },
  "/home/works/firstSubmit/submit": {
    NotSignedin: {
      dbProcedures: [],
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: ["submit_first_work"],
      redirect: "/home",
      method: "post",
      event: "submit",
      fallback: "/home",
    },
    SignedinAsArtist: {
      dbProcedures: [],
      redirect: "/home",
    },
  },
  "/home/works/submit": {
    NotSignedin: {
      dbProcedures: [],
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: [],
      redirect: "/home/works/firstSubmit",
    },
    SignedinAsArtist: {
      dbProcedures: [],
      render: "Submit",
    },
  },
  "/home/works/submit/submit": {
    NotSignedin: {
      dbProcedures: [],
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: [],
      redirect: "/home",
    },
    SignedinAsArtist: {
      dbProcedures: ["submit_work"],
      redirect: "/home",
      method: "post",
      event: "submit",
      fallback: "/home",
    },
  },
  "/profile/works/work/:artistId/:workId/withdraw": {
    NotSignedin: {
      dbProcedures: [],
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: [],
      redirect: "/home",
    },
    SignedinAsArtist: {
      dbProcedures: [],
      render: "Withdraw",
    },
  },
  "/profile/works/work/:artistId/:workId/withdraw/submit": {
    NotSignedin: {
      dbProcedures: [],
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: [],
      redirect: "/home",
    },
    SignedinAsArtist: {
      dbProcedures: ["withdraw_work"],
      redirect: "/home",
      method: "post",
      event: "withdraw",
      fallback: "/home",
    },
  },
  "/home/artists/more": {
    NotSignedin: {
      dbProcedures: [],
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: ["see_more_artists"],
      render: "MoreArtists",
      fallback: "/home",
    }, //TO DO
    SignedinAsArtist: {
      dbProcedures: ["see_more_artists"],
      fallback: "/home",
    }, //TO DO
  },
  "/home/works/more": {
    NotSignedin: {
      dbProcedures: [],
      render: "MoreArtists",
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: ["see_more_works"],
      render: "MoreWorks",
      fallback: "/home",
    }, 
    SignedinAsArtist: {
      dbProcedures: ["see_more_works"],
      render: "MoreWorks",
      fallback: "/home",
    }, 
  },
  "/profile/users/user/:userId": {
    NotSignedin: {
      dbProcedures: [],
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: [],
      redirect: "/home",
    }, //TO DO
    SignedinAsArtist: {
      dbProcedures: ["view_user"],
      fallback: "/home",
    }, //TO DO
  },
  "/profile/artists/artist/:artistId": {
    NotSignedin: {
      dbProcedures: [],
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: ["view_artist", "view_works_of_artist"],
      fallback: "/home",
    },
    SignedinAsArtist: {
      dbProcedures: ["view_artist", "view_works_of_artist"],
      fallback: "/home",
    },
  }, //TO DO
  "/profile/users/user/:artistId/:userArtistId/ban": {
    NotSignedin: {
      dbProcedures: [],
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: [],
      redirect: "/home",
    },
    SignedinAsArtist: {
      dbProcedures: [],
    },
  },
  "/profile/users/user/:artistId/:userArtistId/ban/submit": {
    NotSignedin: {
      dbProcedures: [],
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: [],
      redirect: "/home",
    },
    SignedinAsArtist: {
      dbProcedures: ["ban_watcher"],
      redirect: "/home",
      method: "post",
      event: "ban",
      fallback: "/home",
    },
  },
  "/profile/artists/artist/:userId/:artistId/watch": {
    NotSignedin: {
      dbProcedures: [],
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: ["watch_artist"],
      event: "watch",
      fallback: "/home",
    },
    SignedinAsArtist: {
      dbProcedures: ["watch_artist"],
      event: "watch",
      fallback: "/home",
    },
  },
  "/profile/artists/artist/:userId/:userArtistId/rewatch": {
    NotSignedin: {
      dbProcedures: [],
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: ["rewatch_artist"],
      event: "watch",
      fallback: "/home",
    },
    SignedinAsArtist: {
      dbProcedures: ["rewatch_artist"],
      event: "watch",
      fallback: "/home",
    },
  },
  "/profile/artists/artist/:userId/:userArtistId/unwatch": {
    NotSignedin: {
      dbProcedures: [],
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: ["unwatch_artist"],
      event: "unwatch",
      fallback: "/home",
    },
    SignedinAsArtist: {
      dbProcedures: ["unwatch_artist"],
      event: "unwatch",
      fallback: "/home",
    },
  },
  "/profile/works/work/:workId": {
    NotSignedin: {
      dbProcedures: [],
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: ["view_work"],
      render : "Work",
      redirect: "/home",
    },
    SignedinAsArtist: {
      dbProcedures: ["view_work"],
      render : "Work",
      fallback: "/home",
    },
  }, 
  "/profile/works/work/:userId/:userWorkId/like": {
    NotSignedin: {
      dbProcedures: [],
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: ["like_work"],
      event: "like",
      redirect:"/home",
      fallback: "/home",
    },
    SignedinAsArtist: {
      dbProcedures: ["like_work"],
      event: "like",
      redirect:"/home",
      fallback: "/home",
    },
  },
  "/profile/works/work/:userId/:userWorkId/unlike": {
    NotSignedin: {
      dbProcedures: [],
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: ["unlike_work"],
      event: "unlike",
      redirect:"/home",
      fallback: "/home",
    },
    SignedinAsArtist: {
      dbProcedures: ["unlike_work"],
      event: "unlike",
      redirect:"/home",
      fallback: "/home",
    },
  },
  "/signout": {
    NotSignedin: {
      dbProcedures: [],
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: [],
      render: "Signout",
    },
    SignedinAsArtist: {
      dbProcedures: [],
      render: "Signout",
    },
  },
  "/signout/submit": {
    NotSignedin: {
      dbProcedures: [],
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: [],
      redirect: "/",
      method: "get",
    },
    SignedinAsArtist: {
      dbProcedures: [],
      redirect: "/",
      method: "get",
    },
  },
  "/delete": {
    NotSignedin: {
      dbProcedures: [],
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: [],
      render: "Delete",
    },
    SignedinAsArtist: {
      dbProcedures: [],
      render: "Delete",
    },
  },
  "/delete/submit": {
    NotSignedin: {
      dbProcedures: [],
      redirect: "/",
    },
    SignedinAsUser: {
      dbProcedures: ["delete_"],
      redirect: "/",
      method: "post",
      event: "delete",
      fallback: "/signout",
    },
    SignedinAsArtist: {
      dbProcedures: ["delete_"],
      redirect: "/",
      method: "post",
      event: "delete",
      fallback: "/signout",
    },
  },
};

const routes: Array<RouteData> = Object.entries(routeDBProcedureDict).map(
  ([k, v], i) => {
    return {
      route: k,
      method: (Object.entries(v).filter(([vk,vv]) => (vv.method === 'post')).length > 0)?'post':'get',
      controlers: [
        /*consoleControler,*/
        sessionFirstUpdateControler,
        logToPostgresControler,
        builderFromRoutePath(k, v, hash),
      ],
    };
  }
);

export { routes };
