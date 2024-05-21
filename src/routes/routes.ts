import {  renderControler, showLogsControler, showLogsTableControler } from '../middlewares/index.js';

const routes: Array<{route:string,method:string,procedure?:undefined,controlers :Array<Function>}> = [
    {
      route: '/',
      method: 'get',
      controlers: [renderControler]
    },
    {
      route: '/landing/signin/',
      method: 'get',
      controlers: [renderControler]
    },
    {
      route: '/landing/signup/submit',
      method: 'post',
      procedure : undefined,
      controlers : [renderControler]
    },
    {
      route: '/landing/signup/',
      method: 'get',
      controlers: [renderControler]
    },
    {
      route: '/landing/signup/submit',
      method: 'post',
      procedure : undefined,
      controlers: [renderControler]
    },
    {
      route: '/home',
      method: 'get',
      procedure : undefined,
      controlers: [renderControler]
    },
    {
      route: '/home/artists',
      method: 'get',
      procedure : undefined,
      controlers: [renderControler]
    },
    {
      route: '/home/artists/more',
      method: 'get',
      procedure : undefined,
      controlers: [renderControler]
    },
    {
      route: '/home/works',
      method: 'get',
      procedure : undefined,
      controlers: [renderControler]
    },
    {
      route: '/home/works/more',
      method: 'get',
      procedure : undefined,
      controlers: [renderControler]
    },
    {
      route: '/home/works/myworks',
      method: 'get',
      procedure : undefined,
      controlers: [renderControler]
    },
    {
      route: '/home/works/mywatcher',
      method: 'get',
      procedure : undefined,
      controlers: [renderControler]
    },
    {
      route: '/home/works/myworks/submit',
      method: 'post',
      procedure : undefined,
      controlers: [renderControler]
    },
    {
      route: '/home/profile/users/:user/ban',
      method: 'post',
      procedure : undefined,
      controlers: [renderControler]
    },
    {
      route: '/home/profile/artists/:artist',
      method: 'get',
      procedure : undefined,
      controlers: [renderControler]
    },
    {
      route: '/home/profile/artists/:artist/watch',
      method: 'post',
      procedure : undefined,
      controlers: [renderControler]
    },
    {
      route: '/home/profile/artists/:artist/unwatch',
      method: 'post',
      procedure : undefined,
      controlers: [renderControler]
    },
    {
      route: '/home/profile/works/:work',
      method: 'get',
      procedure : undefined,
      controlers: [renderControler]
    },
    {
      route: '/home/profile/works/:artist/like',
      method: 'post',
      procedure : undefined,
      controlers: [renderControler]
    },
    {
      route: '/home/profile/artists/:artist/unlike',
      method: 'post',
      procedure : undefined,
      controlers: [renderControler]
    },
    {
      route: '/home/logout',
      method: 'post',
      controlers: [renderControler]
    },
    {
      route: '/home/delete',
      method: 'post',
      procedure : undefined,
      controlers: [renderControler]
    },
    {
      route: '/admin',
      method: 'get',
      procedure : undefined,
      controlers: [renderControler]
    },
    {
      route: '/admin/logs',
      method: 'get',
      procedure : undefined,
      controlers: [showLogsTableControler]
    },
    {
      route: '/api/logs',
      method: 'get',
      procedure : undefined,
      controlers: [showLogsControler]
    },
    {
      route: '/users',
      method: 'get',
      controlers: [renderControler]
    },
    {
      route: '/artists',
      method: 'get',
      controlers: [renderControler]
    },
    {
      route: '/works',
      method: 'get',
      controlers: [renderControler]
    },
    {
      route: '/artists/watch',
      method: 'post',
      controlers: [renderControler]
    },
    {
      route: '/works/like',
      method: 'post',
      controlers: [renderControler]
    },
    {
      route: '/artists/unwatch',
      method: 'post',
      controlers: [renderControler]
    },
    {
      route: '/works/unlike',
      method: 'post',
      controlers: [renderControler]
    }
  ];

export {routes};