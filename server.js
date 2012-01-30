var _ = require('underscore');
var io = require('socket.io');
var connect = require('connect');
var everyauth = require('everyauth');
var Fen = require('./src/rex/Fen');
var auth = require('./src/auth/auth').auth;
var gameService = require('./src/services/gameService').GameService;
var userService = require('./src/services/userService').UserService;

var debug = false;
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
        var gameId = generateGameId();
        
        var socket = sockets[whiteUser];
        socket.emit('game_ready', 'w', gameId, blackUser);
        
        socket = sockets[blackUser];
        socket.emit('game_ready', 'b', gameId, whiteUser);
        
        games[gameId] = {
            w: whiteUser,
            b: blackUser
        };

        gameService.push(gameId);
        
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
if (!debug) {
    io.set('log level', 1);
}
if (process.env.PORT) {
    io.set("transports", ["xhr-polling"]); 
    io.set("polling duration", 10); 
} else {
    io.set("transports", ["websocket"]); 
}

io.sockets.on('connection', function (socket) {
    var user = getUser(socket);

    if (user) {
        console.log('authenticated: ', user.email);
        userService.saveUser(user);
        sockets[user.email] = socket;
        socket.emit('auth', user);
    }
    
    socket.on('request_game', function() {
        console.log('request_game', user);
        gameRequests.push(user.email);
        processGameRequests();
    });
    
    socket.on('move', function(gameId, from, to) {
        log('move', arguments);
        var game = games[gameId];
        _.each(game, function(email, side) {
            if (user.email != email) {
                var otherSocket = sockets[email];
                log('emit move', email, typeof otherSocket);
                otherSocket.emit('move', from, to);
            }
        });

        gameService.saveGame(from, to, gameId, game);
    });

    socket.on('find_game', function(user) {
        gameService.findUserGames(user, function(games) {
            if(!games || games.length == 0) {
                return;
            }
            socket.emit('find_game', games);
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

var log = function() {
    if (debug) {
        console.log.apply(console.log, arguments);
    }
};

var generateGameId = function() {
    return Math.floor(Math.random() * 1000000000000000).toString(16);
};

server.listen(port);