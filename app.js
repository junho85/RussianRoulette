var connect = require('connect');
var socketio = require('socket.io');
var fs = require('fs');

var seats = [1, 1, 1, 3, 1, 1, 1];

var server = connect.createServer(connect.router(function (app) {
    app.get('/', function (request, response, next) {
        fs.readFile('index.html', function (error, data) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(data);
        });
    });

    app.get('/seats', function (request, response, next) {
        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify(seats));
    });
}));


var port = 55555;
server.listen(port, function () {
    console.log('Server Running at http://127.0.0.1:' + port);
});

var io = socketio.listen(server);
io.set('log level', 2);

io.sockets.on('connection', function (socket) {
    socket.on('reserve', function (data) {
        seats[data.x] = 2;
        io.sockets.emit('reserve', data);
    });
});