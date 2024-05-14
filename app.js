const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const bodyParser = require('body-parser')
const {routes, router} = require('./routes/index');
const hash = require('./utils/hash');
const { nestedTimeOut, showHashDate, showHashIdDate, delay } = require('./utils/delayedGeneration');
const app = express();
const port = 3001;
const { pool, query } = require('./databases/index');
const { IncomingMessage } = require('http');


//app.use(fooControler);

app.use(express.static('public'));
app.use(cors());
app.use(helmet());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'keyboard cat'
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);

module.exports = { app, port };

