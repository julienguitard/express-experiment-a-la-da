import express, { Application, RequestHandler, ErrorRequestHandler} from "express";
import session, { SessionOptions } from "express-session";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import bodyParser from "body-parser";
import { router } from "./routes/index.js";
import morgan from "morgan";
import {
  errorControler,
  pageNotFoundControler,
} from "./middlewares/index.js";

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
  bodyParser.json()
  //bodyParser.urlencoded({ extended: false })
];

const postRouterUsables:Array<RequestHandler|ErrorRequestHandler>  = [
 //TO DO pageNotFoundControler
]

preRouterUsables.map((u) => app.use(u));
app.use("/", router);
postRouterUsables.map((u) => app.use(u));


export { app, port };
