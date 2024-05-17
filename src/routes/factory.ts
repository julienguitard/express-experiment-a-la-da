import  {Router} from 'express'
import { RequestHandler } from 'express-serve-static-core';
function setRouteMethod(rou:Router, method:string, route:string, controlers:RequestHandler) {
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

export {setRouteMethod};