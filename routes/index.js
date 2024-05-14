const express = require('express');
const router = express.Router();
const {fooControler, indexControler,renderControler,viewControler,consoleControler,logToPostgresControler, showLogsControler,showLogsTableControler} = require('../middlewares/controlers');

const routes = [
  {
      route:'/',
      method:'get',
      controler:[logToPostgresControler,viewControler,renderControler]
  },
  {
    route:'/admin',
    method:'get',
    controler:[logToPostgresControler, viewControler,renderControler]
  },
  {
    route:'/api/logs',
    method:'get',
    controler:[logToPostgresControler, viewControler,showLogsControler]
  },
  {
    route:'/logs',
    method:'get',
    controler:[logToPostgresControler, viewControler,showLogsTableControler]
  },
  {
    route:'/users',
    method:'get',
    controler:[logToPostgresControler, viewControler,renderControler]
  },
  {
    route:'/artists',
    method:'get',
    controler:[logToPostgresControler, viewControler,renderControler]
  },
  {
    route:'/works',
    method:'get',
    controler:[logToPostgresControler, viewControler,renderControler]
  },
  {
    route:'/artists/watch',
    method:'post',
    controler:[logToPostgresControler, viewControler,renderControler]
  },
  {
    route:'/works/like',
    method:'post',
    controler:[logToPostgresControler, viewControler,renderControler]
  },
  {
    route:'/artists/unwatch',
    method:'post',
    controler:[logToPostgresControler, viewControler,renderControler]
  },
  {
    route:'/works/unlike',
    method:'post',
    controler:[logToPostgresControler, viewControler,renderControler]
  }
];

function setRouteMethod (rou,method,route,controlers){
  switch (method){
    case 'get': 
      rou.get(route,controlers);
      break;
    case 'post': 
      rou.post(route,controlers);
      break;
    case 'update': 
      rou.put(route,controlers);
      break;
    case 'delete': 
      rou.delete(route,controlers);
      break;
    default:
      console.log('Unknow method');
   }
;}


routes.map((r)=>setRouteMethod(router,r.method,r.route,r.controler));


module.exports = {routes,router};