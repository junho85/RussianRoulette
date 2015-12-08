var connect = require('connect');
var socketio = require('socket.io');
var fs = require('fs');

var NOT_OPEN = 1;
var LIVE = 2;
var TRAP = 3;
var DEAD = 4;

var names = ['rabbit', 'mouse', 'tiger', 'elephant', 'fox', 'snake', 'dragon'];
var cylinder = get_new_cylinder(names.length, names);

function get_new_cylinder(num, names) {
    var cylinder = [];
    var randomNumber = Math.floor(Math.random() * num);
    console.log("num=" + num + "; randomNumber=" + randomNumber + "; names=" + names);

    for (var i=0; i<num; i++) {
        var chamber = { status: NOT_OPEN, name: names[i] };
        cylinder.push(chamber);
    }

    cylinder[randomNumber].status = TRAP;
    console.log(cylinder);
    return cylinder;
}

var server = connect.createServer(connect.router(function (app) {
    app.get('/', function (request, response, next) {
        fs.readFile('index.html', function (error, data) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(data);
        });
    });

    app.get('/roulette', function (request, response, next) {
        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify(cylinder));
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
        if (cylinder[index] == TRAP) {
            result = DEAD;
        } else {
            result = LIVE;
        }
        cylinder[index] = result;

        io.emit('shot', {x:index, result:result});
    });

    socket.on('reset', function (data) {
        console.log("reset;" + data.num + "; names=" + data.names);
        cylinder = get_new_cylinder(data.num, data.names);
        io.emit('reset', JSON.stringify(cylinder));
    });
});