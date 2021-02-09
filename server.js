const http = require('http');
const port = process.env.PORT || 8081;
const app = require('./app');
const server = http.createServer(app) // inside this listener added ie excecuted whenever we get request.

server.listen(port,()=>{
    console.log('Server Started at localhost:8081');
});