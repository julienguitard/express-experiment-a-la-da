const express = require('express');
const router = express.Router();
const {indexControler,renderControler,viewControler,consoleControler,logToPostgresControler} = require('../middlewares/controlers');

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
    route:'/logs',
    method:'get',
    controler:[logToPostgresControler, viewControler,renderControler]
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

function setRouteMethod (rou,method,route,controler){
  switch (method){
    case 'get': 
      rou.get(route,controler);
      break;
    case 'post': 
      rou.post(route,controler);
      break;
    case 'update': 
      rou.put(route,controler);
      break;
    case 'delete': 
      rou.delete(route,controler);
      break;
    default:
      console.log('Unknow method');
   }
;}


routes.map((r)=>setRouteMethod(router,r.method,r.route,r.controler));


module.exports = {routes,router,viewControler};