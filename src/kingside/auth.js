define('socket.io', function() {
    return io;
});

define(['underscore', 'socket.io'], function(_, io) {
    
    var parseCookie = function(cookies) {
        var s = {};
        _.each(cookies.split(';\ '), function(c) {
            var vals = c.split('=');
             s[vals[0]] = vals[1];
        });
        return s;
    };
    
    return function() {
        console.log(document.cookie);
        var socket = io.connect('http://localhost');
        socket.on('auth', function (userinfo) {
            console.log('user', userinfo);
        });
    };
});
