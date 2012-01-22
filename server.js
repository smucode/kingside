if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

define(['require'], function(require) {
    
    var _ = require('underscore');
    var io = require('socket.io');
    var connect = require('connect');
    var everyauth = require('everyauth');
    var auth = require('./src/auth/auth');
    
    var port = process.env.PORT || 8000;
    
    console.log('starting kingside on port ' + port);
    
    var server = connect(
        connect.static(__dirname),
        connect.bodyParser(),
        connect.cookieParser(),
        connect.session({secret: 'secret', key: 'express.sid'}),
        auth.middleware()
    );

    // socket.io helpers

    var sockets = {};

    var getSocket = function(userId) {
        return sockets[userId];
    };

    var parseCookie = function(cookies) {
        var s = {};
        _.each(cookies.split(';\ '), function(c) {
            var vals = c.split('=');
             s[vals[0]] = vals[1];
        });
        return s;
    };
    
    var getSid = function(socket) {
        return socket.handshake.sessionID;
    };
    
    var getUser = function(socket) {
        var sid = getSid(socket);
        if (sid) {
            sid = decodeURIComponent(sid);
            return auth.getUser(sid);
        }
    };
    
    // game stuff
    
    var games = {};
    var gameRequests = [];
    
    var processGameRequests = function() {
        var whiteUser = gameRequests.pop();
        var blackUser = gameRequests.pop();
        if (whiteUser && blackUser) {
            var gameId = Math.floor(Math.random() * 1000000000000000).toString(16);
            var socket = sockets[whiteUser];
            socket.emit('game_ready', 'w', gameId);
            
            var socket = sockets[blackUser];
            socket.emit('game_ready', 'b', gameId);
            
            games[gameId] = [whiteUser, blackUser];
            
        } else {
            if (whiteUser) {
                gameRequests.push(whiteUser);
            }
            if (blackUser) {
                gameRequests.push(blackUser);
            }
        }
    };
    
    // socket.io stuff
    
    var io = require('socket.io').listen(server);
    io.set('log level', 1);
    
    io.sockets.on('connection', function (socket) {
        var user = getUser(socket);
        
        if (user) {
            console.log('authenticated: ', user.email);
            sockets[user.email] = socket;
            socket.emit('auth', user);
        }
        
        socket.on('request_game', function() {
            gameRequests.push(user.email);
            processGameRequests();
        });
        
        socket.on('move', function(gameId, from, to) {
            var game = games[gameId];
            _.each(game, function(email) {
                if (user.email != email) {
                    var otherSocket = sockets[email];
                    otherSocket.emit('move', from, to);
                }
            });
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