import express from 'express';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import bodyParser from 'body-parser';
import {router} from './routes/index.js';
import {IncomingMessage } from 'http';

const app = express();
const port = 3001;

//app.use(fooControler);

app.use(express.static('public'));
app.use(cors());
app.use(helmet());
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'keyboard cat'
}));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', router);

export { app, port };

