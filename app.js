var serveStatic = require('serve-static');
var socketio = require('socket.io');
var fs = require('fs');

var express = require('express');
var app = express();

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

function convert_cylinder_for_client(cylinder) {
    var cylinder_for_client = [];
    for (var i=0; i<cylinder.length; i++) {
        var status = cylinder[i].status;
        if (status == TRAP) {
            status = NOT_OPEN;
        }
        var chamber = { status: status, name: cylinder[i].name };

        cylinder_for_client.push(chamber);
    }
    return cylinder_for_client;
}

// static
app.use('/sound', serveStatic(__dirname + '/sound'));
app.use('/images', serveStatic(__dirname + '/images'));
app.use('/css', serveStatic(__dirname + '/css'));
app.use('/js', serveStatic(__dirname + '/js'));

app.use('/cylinder', function (request, response, next) {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(convert_cylinder_for_client(cylinder)));
});

app.use('/', function (request, response, next) {
    fs.readFile('index.html', function (error, data) {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(data);
    });
});

var port = 55555;

var server = app.listen(port, function () {
    console.log('Server Running at http://127.0.0.1:' + port);
});

var io = socketio.listen(server);

io.sockets.on('connection', function (socket) {
    socket.on('shot', function (data) {
        var index = data.x;

        var result = 0;
        if (cylinder[index].status == TRAP) {
            result = DEAD;
        } else {
            result = LIVE;
        }
        cylinder[index].status = result;

        io.emit('shot', {x:index, result:result});
    });

    socket.on('reset', function (data) {
        cylinder = get_new_cylinder(data.num, data.names);
        io.emit('reset', JSON.stringify(cylinder));
    });
});