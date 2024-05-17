import { app, port } from './app.js';
import {mockRenderFile} from './test/views/renderFile.js';

app.listen(port);
console.log(`Express started on port ${port}`);

