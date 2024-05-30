import express, { Application, RequestHandler } from "express";
import session, { SessionOptions } from "express-session";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import bodyParser from "body-parser";
import { router } from "./routes/index.js";
import morgan from 'morgan';
import {
  errorControler,
  mockErrorControler,
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

app.use(express.static("public"));
app.use(cors());
app.use(helmet());
app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", router);
app.use(pageNotFoundControler);
app.use(mockErrorControler);

export { app, port };
