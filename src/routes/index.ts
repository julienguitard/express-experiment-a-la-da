import express, {Router} from 'express';
import  {logToPostgresControler,viewControler} from '../middlewares/index.js';
import {setRouteMethod} from './factory.js';
import {routes,} from './routes.js';
const router:Router = express.Router();

routes.map((r)=>setRouteMethod(router, r.method, r.route,r.controlers));

export  {router};



