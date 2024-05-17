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

export {setRouteMethod};