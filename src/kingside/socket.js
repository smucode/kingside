define('socket.io', function() {
    return io;
});

define(['socket.io'], function(io) {
    var socket = io.connect('http://kingsi.de/');
    socket.on('auth', function (user) {
        socket.user = user;
    });
    return socket;
});
