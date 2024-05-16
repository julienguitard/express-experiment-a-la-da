const express = require('express');
const  {logToPostgresControler,viewControler} = require('../middlewares/controlers');
const setRouteMethod =require('./factory');
const routes = require('./routes');
const router = express.Router();

routes.map((r) => setRouteMethod(router, r.method, r.route, [logToPostgresControler,viewControler].concat(r.controlers)));

module.exports = router;