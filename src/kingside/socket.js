define(['socket.io'], function(io) {
    // var socket = io.connect('http://kingsi.de/');
    var socket = io.connect('http://blazing-beach-1994.herokuapp.com/');
    socket.on('auth', function (user) {
        socket.user = user;
    });
    return socket;
});
