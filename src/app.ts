import express, { Application, Router, RequestHandler, ErrorRequestHandler} from "express";
import session, { SessionOptions } from "express-session";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import {pool} from './databases/index';
import {routeDBProcedureDict,generateRouter} from "./routes/index.js";
import morgan from "morgan";


const app: Application = express();
const port: number = 3001;
const sessionOptions: SessionOptions = {
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: "keyboard cat",
};
const sessionMiddleware: RequestHandler = session(sessionOptions);

app.set("views", "./views");
app.set("view engine", "ejs");

const preRouterUsables:Array<RequestHandler> = [
  express.static("public"),
  cors(),
  helmet(),
  sessionMiddleware,
  bodyParser.urlencoded({ extended: false })
];

const postRouterUsables:Array<RequestHandler|ErrorRequestHandler>  = []

const router:Router = generateRouter(routeDBProcedureDict,pool);
preRouterUsables.map((u) => app.use(u));
app.use("/", router);
postRouterUsables.map((u) => app.use(u));

export { app, port };
