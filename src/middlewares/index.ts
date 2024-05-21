import { pool, queryPool } from '../databases/index.js';
import {insert_into_requests_logs,insert_into_errors_logs,insert_into_responses_logs,select_full_logs } from '../databases/procedures.js';
import {Request,Response,NextFunction} from 'express';
import {Session, SessionData} from 'express-session';
import errorConsoleLog from '../utils/errorConsoleLog.js';
import{getTime,parseSQLOutput,SessionUserData} from './handlers.js';
import { getDefaultAutoSelectFamilyAttemptTimeout } from 'net';


const getIndexProps = (session:SessionUserData) => {return {
  header:{
    title:'Jus sandbox'
  },
  footer:{
    signedinAs : session.userId||'none',
    startTime : session.startTime||getTime()
  }
}};

const indexControler = function (req:Request, res:Response, next:NextFunction) {
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

  const  indexProps = {
    header:{
      title:'Jus sandbox'
    },
    footer:{
      signedinAs : 'Ju',
      startTime : '2024-05-20 00:00:00'
    }
  }

  res.render('Index',{indexProps:indexProps});
};

const renderControler = function (req:Request, res:Response, next:NextFunction) {
  console.log('renderControler');
  try {
    //res.render('index', {footer:{ views: req.session.views, userName: 'self' }});

    const  indexProps = {
      header:{
        title:'Jus sandbox'
      },
      footer:{
        signedinAs : 'Ju',
        startTime : '2024-05-20 00:00:00'
      }
    }
    res.render('Index',{indexProps:indexProps});
  }
  catch (e) {
    console.log(e);
  }
  finally {
    next();
  }
};

const dataControler = function (req:Request, res:Response, next:NextFunction) {
  try {
    res.send(res.json);
  }
  catch (e) {
    console.log(e);
  }
  finally {
    next();
  }
};

const viewControler = function (req:Request, res:Response, next:NextFunction) {
  console.log('viewControler');
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

const consoleControler = function (req:Request, res:Response, next:NextFunction) {
  console.log(Object.entries(req.route.methods).filter(([k, v]) => v).map(([k, v]) => k) + ' ' + req.route.path);
}

const clockControler = function (req:Request, res:Response, next:NextFunction) {
  const data_ = queryPool(pool, 'SELECT NOW() AS time_, $1 AS check_,', req.params);
  data_.then(data => res.status(200).send(data)).catch(err => res.status(50).send(err));
};

const logToPostgresControler = function (req:Request, res:Response, next:NextFunction) {
  const meths = Object.entries(req.route.methods).filter(([k, v]) => v).map(([k, v]) => k).join(',');
  const now_ = getTime();
  const reqData = queryPool(pool, insert_into_requests_logs, [now_, req.route.path, meths]);
  const nextVoid = reqData.then((r) => {next()});
  const errVoid = nextVoid.catch(err => {
    let no = getTime();
    return queryPool(pool, insert_into_errors_logs, [now_, no, req.route.path, err]);
  });
  const resData =  errVoid.finally(() => {
    let no = getTime();
    return queryPool(pool, insert_into_responses_logs, [now_, no, req.route.path, res.statusCode])
  });
}

const showLogsControler = function (req,res,next) {
  const resData = queryPool(pool,select_full_logs,[]).then(data=>{console.log(data.fields,data.rows);
    res.json({"data":parseSQLOutput(data[0])})
  });
}

const showLogsTableControler = function (req,res,next) {
  const resData = queryPool(pool,select_full_logs,[]).then(data=>{
    console.log(parseSQLOutput(data));
    const props = {footer:{views: req.session.views, userName: 'self' },data:parseSQLOutput(data)};
    res.render('tableIndex.ejs',props);
  })
}

const landingControler = function(req:Request,res:Response,next:NextFunction):void {

  if (req.session.userId) {
    res.redirect('/home');
  } else {
    res.redirect('/landing/signin/');
  }
}

const errorControler = function (err:Error,req:Request,res:Response,next:NextFunction):void {
  props = getIndexProps(req.session);
  getIndexProps.body = {errorPage:{err:err}};
  res.render('Index', props);
}



export {indexControler, renderControler, viewControler, consoleControler, logToPostgresControler, showLogsControler, showLogsTableControler,errorControler};