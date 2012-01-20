define('socket.io', function() {
    return io;
});

define(['socket.io'], function(io) {
    return io.connect('http://kingsi.de/');
});
