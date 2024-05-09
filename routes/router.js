const express = require('express');
const router = express.Router();
const {indexControler,renderControler,viewControler,consoleControler} = require('../middlewares/controlers');

const routes = [
  {
      route:'/',
      method:'get',
      controler:[viewControler,renderControler,consoleControler]
  },
  {
    route:'/users',
    method:'get',
    controler:[viewControler,renderControler,consoleControler]
  },
  {
    route:'/artists',
    method:'get',
    controler:[viewControler,renderControler,consoleControler]
  },
  {
    route:'/works',
    method:'get',
    controler:[viewControler,renderControler,consoleControler]
  },
  {
    route:'/artists/interactions',
    method:'get',
    controler:[viewControler,renderControler,consoleControler]
  },
  {
    route:'/works/interactions',
    method:'get',
    controler:[viewControler,renderControler,consoleControler]
  },
  {
    route:'/artists/watch',
    method:'post',
    controler:[viewControler,renderControler,consoleControler]
  },
  {
    route:'/works/like',
    method:'post',
    controler:[viewControler,renderControler,consoleControler]
  },
  {
    route:'/artists/unwatch',
    method:'post',
    controler:[viewControler,renderControler,consoleControler]
  },
  {
    route:'/works/unlike',
    method:'post',
    controler:[viewControler,renderControler,consoleControler]
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