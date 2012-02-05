var app = require('../app/app').app;

var sio = require('socket.io');

var io = sio.listen(app);
io.set('log level', 1);

exports.io = io;