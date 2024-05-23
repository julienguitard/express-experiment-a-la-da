import { app, port } from './app.js';

declare module 'express-session' {

    interface SessionData {
      userId: string;
      artistId: string,
      startTime: string,
      views: number
    }
  }  

app.listen(port);
console.log(`Express started on port ${port} with tsx!`);

