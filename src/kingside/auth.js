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
        var fns = [];
        var user = null;

        var fire = function() {
            if (user) {
                _.each(fns, function(fn) {
                    fn(user);
                });
            }
        };
        
        var socket = io.connect('http://kingsi.de/');
        socket.on('auth', function (userinfo) {
            console.log('user', userinfo);
            user = userinfo;
            fire();
        });
        
        return {
            onAuth: function(fn) {
                fns.push(fn);
                if (user) {
                    fn(user);
                }
            }
        }
    };
});
