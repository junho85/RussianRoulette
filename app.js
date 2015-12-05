var connect = require('connect');
var socketio = require('socket.io');
var fs = require('fs');

var NOT_OPEN = 1;
var LIVE = 2;
var TRAP = 3;
var DEAD = 4;

var roulette = [NOT_OPEN, NOT_OPEN, NOT_OPEN, TRAP, NOT_OPEN, NOT_OPEN, NOT_OPEN];

var server = connect.createServer(connect.router(function (app) {
    app.get('/', function (request, response, next) {
        fs.readFile('index.html', function (error, data) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(data);
        });
    });

    app.get('/roulette', function (request, response, next) {
        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify(roulette));
    });
}));


var port = 55555;
server.listen(port, function () {
    console.log('Server Running at http://127.0.0.1:' + port);
});

var io = socketio.listen(server);

io.sockets.on('connection', function (socket) {
    socket.on('shot', function (data) {
        var index = data.x;
        var result = 0;
        if (roulette[index] == TRAP) {
            result = DEAD;
        } else {
            result = LIVE;
        }
        roulette[index] = result;

        io.emit('shot', {x:index, result:result});
    });

    socket.on('reset', function (data) {
        console.log("reset;" + data.num);
        roulette = [NOT_OPEN, NOT_OPEN, NOT_OPEN, TRAP, NOT_OPEN, NOT_OPEN, NOT_OPEN];
        io.emit('reset', JSON.stringify(roulette));
    });
});