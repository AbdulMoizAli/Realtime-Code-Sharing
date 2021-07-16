const http = require('http');
const { Server } = require('node-static');

const fileServer = new Server('./public');

http.createServer((req, res) => fileServer.serve(req, res)).listen(5000, () =>
    console.log('Web client running on http://localhost:5000')
);
