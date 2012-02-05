var app = require('../app/app').app
var io = require('socket.io').listen(app);

exports.io = io;