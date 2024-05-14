const { app, port } = require('./app');
const mockRenderFile = require('./test/views/renderFile');

app.listen(port);
console.log(`Express started on port ${port}`);