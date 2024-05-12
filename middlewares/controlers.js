const { pool, queryPool } = require("../databases");
const errorConsoleLog = require('../utils/errorConsoleLog');
const sql_now =require('./handlers');

const indexControler = function (req, res, next) {
  if (req.session) {
    if (!('views' in req.session)) {
      req.session.views = 0;
    }
    else {
      ++req.session.views;
    }
  }
  else {
    throw ('Session should be initialized');
  }
  res.render('index', { views: req.session.views });
};

const renderControler = function (req, res, next) {
  try {
    res.render('index', { views: req.session.views, userName: 'self' });
  }
  catch (e) {
    console.log(e);
  }
  finally {
    next();
  }
};

const viewControler = function (req, res, next) {
  if (req.session) {
    if (!('views' in req.session)) {
      req.session.views = 0;
    }
    else {
      ++req.session.views;
    }
  }
  else {
    //TO DO
    req.session.views = 0;
  }
  next();
}

const consoleControler = function (req, res, next) {
  console.log(Object.entries(req.route.methods).filter(([k, v]) => v).map(([k, v]) => k) + ' ' + req.route.path);
}

const clockControler = function (req, res, next) {
  const data_ = queryPool(pool, 'SELECT NOW() AS time_, $1 AS check_,', req.params);
  data_.then(data => res.status(200).send(data)).catch(err => res.status(50).send(err));
};

const logToPostgresControler = function (req, res, next) {
  const meths = Object.entries(req.route.methods).filter(([k, v]) => v).map(([k, v]) => k).join(',');
  const now_ = sql_now();
  const reqData = queryPool(pool, 'INSERT INTO requests_logs (SELECT * FROM generate_requests_logs_event($1,$2,$3))', [now_,req.route.path,meths]);
  const reqVoid = reqData.then(data => console.log(data.rows)).catch(errorConsoleLog);
  const nextVoid = reqVoid.then(next)
  const errData = nextVoid.catch(err=>queryPool(pool, 'INSERT INTO error_logs (SELECT * FROM generate_errors_logs_event($1,$2,$3))', [now_,req.route.path,err]));
  const resData = errData.finally(()=>queryPool(pool, 'INSERT INTO responses_logs (SELECT * FROM generate_responses_logs_event($1,$2,$3))', [now_,req.route.path,res.statusCode]));
  resData.then(data => console.log(data.rows)).catch(errorConsoleLog);
}

module.exports = { indexControler, renderControler, viewControler, consoleControler, logToPostgresControler };