import { Request, Response } from "express";
import { Pool, QueryResult } from "pg";
import { queryPool } from "../databases/index.js";
import { hash } from "../utils/hash.js";
import { Session, SessionData } from "express-session";
import type {
  IndexPage,
  Header,
  LandingPage,
  SigninForm,
  SignupForm,
  FormPage,
  Form,
  UserHomePage,
  Table,
  ArtistHomePage,
  TablePage,
  EntityPage,
  Entity,
  ErrorPage,
  Footer,
} from "types";
import { UbiquitousConcept, CellProps } from "../types.js";

function getTitle(): string {
  return "Jus page";
}

function getHeader(): Header {
  return { title: getTitle() };
}

function getTime(): string {
  return (Date.now() / 1000).toString();
}

function getSigninAs(session: SessionData): string {
  return session.userId || "none";
}

function getStartTime(session: SessionData): string {
  return session.startTime || getTime();
}

function getErrorPage(err: Error): ErrorPage {
  return { error: err.toString() };
}

function getFooter(session: SessionData): Footer {
  return {
    signedinAs: getSigninAs(session),
    startTime: getStartTime(session),
  };
}

//function getFormProps(formType:string):Form{
//
//}

function getUserId(
  route: Request["route"],
  session: SessionData,
  params: Request["params"]
): string {
  if (":artistId" in route.split("/")) {
    return params.userId;
  } else if (session.userId) {
    return session.userId;
  } else if (params.userName && params.pwd) {
    return hash(params.userName);
  } else {
    throw Error("Unmatched case");
  }
}

function getUserName(params: Request["params"]): string {
  if (params.userName && params.pwd) {
    return params.userName;
  } else {
    throw Error("Unmatched case");
  }
}

function getPwd(params: Request["params"]): string {
  if (params.userName && params.pwd) {
    return hash(params.pwd);
  } else {
    throw Error("Unmatched case");
  }
}

function getKey(route: Request["route"]): string {
  //TO DO
  if ("delete" in route.split("/")) {
    return "delete";
  } else if ("watch" in route.split("/")) {
    return "watch";
  } else if ("signup" in route.split("/")) {
    return "create";
  } else if ("submit" in route.split("/")) {
    return "submit";
  } else if ("like" in route.split("/")) {
    return "like";
  } else {
    return "create";
  }
}

function getArtistId(
  route: Request["route"],
  session: SessionData,
  params: Request["params"]
): string {
  if (":artistId" in route.split("/")) {
    return params.artistId;
  } else if (session.artistId) {
    return session.artistId;
  } else if (session.userId) {
    return hash(session.userId);
  } else {
    throw Error("Unmatched case");
  }
}

function getWorkId(route: Request["route"], params: Request["params"]): string {
  if (":workId" in route.split("/")) {
    return params.workId;
  } else {
    throw Error("Unmatched case");
  }
}

function getUserArtistId(
  route: Request["route"],
  session: SessionData,
  params: Request["params"]
): string {
  if (":artistId" in route.split("/") && session.userId) {
    return hash(params.artistId + session.userId);
  } else {
    throw Error("Unmatched case");
  }
}

function getUserWorkId(
  route: Request["route"],
  session: SessionData,
  params: Request["params"]
): string {
  if (":workId" in route.split("/") && session.userId) {
    return hash(params.workId + session.userId);
  } else {
    throw Error("Unmatched case");
  }
}

function requestParamsHandler(
  route: Request["route"],
  session: SessionData,
  params: Request["params"]
): Record<string, any> {
  return {
    userId: getUserId(route, session, params),
    time: getTime(),
    userName: getUserName(params),
    pwd: getPwd(params),
    key: getKey(route),
    artistId: getArtistId(route, session, params),
    workId: getWorkId(route, params),
    userArtistId: getUserArtistId(route, session, params),
    workArtistId: getUserWorkId(route, session, params),
  };
}

function dbHandlerBuilder(
  pool: Pool,
  proc: string,
  procArgs: Array<string>
): (params: Record<string, any>) => Promise<QueryResult<any>> {
  function dbHandler(params: Record<string, any>): Promise<QueryResult<any>> {
    return queryPool(
      pool,
      "SELECT * FROM " + proc,
      procArgs.map((a) => params[a])
    );
  }
  return dbHandler;
}

function outputCallbackBuilder(route: string, url?: string): any {
  if ("api" in route.split("/")) {
    return (res: Response, props: Object) => {
      res.json(props);
    };
  } else if (route) {
    return (res: Response, props: Object) => {
      res.render("index.js", props);
    };
  } else if (url) {
    return (res: Response, props: Object) => {
      res.redirect(url);
    };
  } else {
    throw Error("Unmatched case");
  }
}

function parseSQLOutput(
  data: { fields: Array<{ name: string }>; rows: Array<Record<string, any>> },
  cb?: (field: string, value: any) => any
): { fields: Array<string>; rows: Array<Array<any>> } {
  const fields = data.fields.map((f) => f.name);
  let rows = data.rows.map((r) => fields.map((c) => r[c]));
  if (cb) {
    rows = data.rows.map((r) => fields.map((c) => cb(c, r[c])));
  }
  const parsedData = { fields: fields, rows: rows };
  return parsedData;
}

function convertToCellProps(field: string, cell: any): CellProps {
  let props = { value: cell, link: undefined };
  if (field === "user_id") {
    Object.defineProperty(props,'link',`/parametrized/profile/users/user?${cell}`);
  } else if (field === "artist_id") {
    Object.defineProperty(props,'link',`/parametrized/profile/artists/artist?${cell}`);
  } else if (field === "work_id") {
    Object.defineProperty(props,'link',`/parametrized/profile/works/work?${cell}`);
  } else if (field === "ban") {
    Object.defineProperty(props,'link',`/parametrized/profile/users/user?${cell}/ban`);
  } else if (field === "withdraw") {
    Object.defineProperty(props,'link',`/parametrized/profile/works/work?${cell}/withdraw`);}
    else if (field === "unlike") {
        Object.defineProperty(props,'link',`/parametrized/profile/works/work?${cell}/unlike`);}
  return props;
}

export { getTime, parseSQLOutput };
