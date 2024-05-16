const {  renderControler, showLogsControler, showLogsTableControler } = require('../middlewares/controlers');

const routes = [
    {
      route: '/',
      method: 'get',
      controlers: [renderControler]
    },
    {
      route: '/login',
      method: 'get',
      controlers: [renderControler]
    },
    {
      route: '/login/submit',
      method: 'post',
      controlers: [renderControler]
    },
    {
      route: '/login/signin',
      method: 'get',
      controlers: [renderControler]
    },
    {
      route: '/login/signin/submit',
      method: 'post',
      controlers: [renderControler]
    },
    {
      route: '/home',
      method: 'get',
      controlers: [renderControler]
    },
    {
      route: '/home/artists',
      method: 'get',
      controlers: [renderControler]
    },
    {
      route: '/home/artists/more',
      method: 'get',
      controlers: [renderControler]
    },
    {
      route: '/home/works',
      method: 'get',
      controlers: [renderControler]
    },
    {
      route: '/home/works/more',
      method: 'get',
      controlers: [renderControler]
    },
    {
      route: '/home/works/myworks',
      method: 'get',
      controlers: [renderControler]
    },
    {
      route: '/home/works/mywatcher',
      method: 'get',
      controlers: [renderControler]
    },
    {
      route: '/home/works/myworks/submit',
      method: 'get',
      controlers: [renderControler]
    },
    {
      route: '/home/profile/users/:user/ban',
      method: 'post',
      controlers: [renderControler]
    },
    {
      route: '/home/profile/artists/:artist',
      method: 'get',
      controlers: [renderControler]
    },
    {
      route: '/home/profile/artists/:artist/watch',
      method: 'post',
      controlers: [renderControler]
    },
    {
      route: '/home/profile/artists/:artist/unwatch',
      method: 'post',
      controlers: [renderControler]
    },
    {
      route: '/home/profile/works/:work',
      method: 'get',
      controlers: [renderControler]
    },
    {
      route: '/home/profile/works/:artist/like',
      method: 'post',
      controlers: [renderControler]
    },
    {
      route: '/home/profile/artists/:artist/unlike',
      method: 'post',
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
      controlers: [renderControler]
    },
    {
      route: '/admin',
      method: 'get',
      controlers: [renderControler]
    },
    {
      route: '/admin/logs',
      method: 'get',
      controlers: [showLogsTableControler]
    },
    {
      route: '/api/logs',
      method: 'get',
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

  module.exports = routes