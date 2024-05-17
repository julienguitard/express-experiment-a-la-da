import express from 'express';
import  {logToPostgresControler,viewControler} from '../middlewares/controlers.js';
import {setRouteMethod} from './factory.js';
import {routes} from './routes.js';
const router = express.Router();

routes.map((r) => setRouteMethod(router, r.method, r.route, [logToPostgresControler,viewControler].concat(r.controlers)));

export  {router};