if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

define(['require', './src/auth/auth'], function(require, auth) {
    
    var _ = require('underscore');
    var io = require('socket.io');
    var connect = require('connect');
    var everyauth = require('everyauth');
    
    var port = process.env.PORT || 8000;
    
    console.log('starting kingside on port ' + port);
    
    var server = connect(
        connect.static(__dirname),
        connect.bodyParser(),
        connect.cookieParser(),
        connect.session({secret: 'secret', key: 'express.sid'}),
        auth.middleware()
    );
    
    var io = require('socket.io').listen(server);
    io.set('log level', 1);
    
    var parseCookie = function(cookies) {
        var s = {};
        _.each(cookies.split(';\ '), function(c) {
            var vals = c.split('=');
             s[vals[0]] = vals[1];
        });
        return s;
    };
    
    io.sockets.on('connection', function (socket) {
        var sid = socket.handshake.sessionID;
        if (sid) {
            sid = decodeURIComponent(sid);
            var u = auth.getUser(sid);
            if (u) {
                console.log('authenticated: ', u.email);
                socket.emit('auth', u);
            }
        }
        socket.on('request_game', function() {
            socket.emit('game_ready');
        });
    });
    
    io.set('authorization', function (data, accept) {
        if (data.headers.cookie) {
            data.cookie = parseCookie(data.headers.cookie);
            data.sessionID = data.cookie['express.sid'];
        }
        accept(null, true);
    });
    
    server.listen(port);
});