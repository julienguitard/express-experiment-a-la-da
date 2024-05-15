const express = require('express');
const router = express.Router();
const { fooControler, indexControler, renderControler, viewControler, consoleControler, logToPostgresControler, showLogsControler, showLogsTableControler } = require('../middlewares/controlers');

const routes = [
  {
    route: '/',
    method: 'get',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/login',
    method: 'get',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/login/submit',
    method: 'post',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/login/signin',
    method: 'get',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/login/signin/submit',
    method: 'post',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/home',
    method: 'get',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/home/artists',
    method: 'get',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/home/artists/more',
    method: 'get',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/home/works',
    method: 'get',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/home/works/more',
    method: 'get',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/home/works/myworks',
    method: 'get',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/home/works/mywatcher',
    method: 'get',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/home/works/myworks/submit',
    method: 'get',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/home/profile/user/:user/ban',
    method: 'post',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/home/profile/artist/:artist',
    method: 'get',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/home/profile/artist/:artist/watch',
    method: 'post',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/home/profile/artist/:artist/unwatch',
    method: 'post',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/home/profile/work/:work',
    method: 'get',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/home/profile/work/:artist/like',
    method: 'post',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/home/profile/artist/:artist/unlike',
    method: 'post',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/home/logout',
    method: 'post',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/home/delete',
    method: 'post',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/admin',
    method: 'get',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/admin/logs',
    method: 'get',
    controler: [logToPostgresControler, viewControler, showLogsTableControler]
  },
  {
    route: '/api/logs',
    method: 'get',
    controler: [logToPostgresControler, viewControler, showLogsControler]
  },
  {
    route: '/users',
    method: 'get',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/artists',
    method: 'get',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/works',
    method: 'get',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/artists/watch',
    method: 'post',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/works/like',
    method: 'post',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/artists/unwatch',
    method: 'post',
    controler: [logToPostgresControler, viewControler, renderControler]
  },
  {
    route: '/works/unlike',
    method: 'post',
    controler: [logToPostgresControler, viewControler, renderControler]
  }
];

function setRouteMethod(rou, method, route, controlers) {
  switch (method) {
    case 'get':
      rou.get(route, controlers);
      break;
    case 'post':
      rou.post(route, controlers);
      break;
    case 'update':
      rou.put(route, controlers);
      break;
    case 'delete':
      rou.delete(route, controlers);
      break;
    default:
      console.log('Unknow method');
  }
  ;
}


routes.map((r) => setRouteMethod(router, r.method, r.route, r.controler));


module.exports = { routes, router };