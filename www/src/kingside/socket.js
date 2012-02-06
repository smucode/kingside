define(['socket.io'], function(io) {
    var socket;
    
    if (window.location.port == 8000) {
        socket = io.connect('http://kingsi.de/');
    } else {
        socket = io.connect('http://blazing-beach-1994.herokuapp.com/');
    }
    
    socket.on('auth', function (user) {
        socket.user = user;
    }).on('find_game', function () {
        console.info(arguments);
    });
    
    return socket;
});
