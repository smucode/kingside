define('socket.io', function() {
    return io;
});

define(['underscore', 'socket.io'], function(_, io) {
    return function() {
        var socket = io.connect('http://localhost');
        socket.on('auth', function (userinfo) {
            console.log('user', userinfo);
        });
    };
});
