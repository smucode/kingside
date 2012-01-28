var _ = require('underscore');
var io = require('socket.io');
var connect = require('connect');
var everyauth = require('everyauth');
var auth = require('./src/auth/auth').auth;
var dao = require('./src/dao/db').Db;

var debug = true;
var port = process.env.PORT || 8000;

console.log('starting kingside on port ' + port);

var server = connect(
    connect.static(__dirname),
    connect.bodyParser(),
    connect.cookieParser(),
    connect.session({secret: 'secret', key: 'express.sid'}),
    auth.middleware()
);

dao.connect();

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

var saveUser = function(user) {
    dao.findUser({email: user.email}, function(err, users) {
        if(_.isEmpty(users)) {
            dao.saveUser({name: user.firstname + ' ' + user.lastname, email: user.email},
                function() {
                    console.log('user saved', user);
                }
            );
        }
    });
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
        socket.emit('game_ready', 'w', gameId);
        
        socket = sockets[blackUser];
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
        saveUser(user);
        sockets[user.email] = socket;
        socket.emit('auth', user);
    }
    
    socket.on('request_game', function() {
        gameRequests.push(user.email);
        processGameRequests();
    });
    
    socket.on('move', function(gameId, from, to) {
        log('move', arguments);
        var game = games[gameId];
        _.each(game, function(email) {
            if (user.email != email) {
                var otherSocket = sockets[email];
                log('emit move', email, typeof otherSocket);
                otherSocket.emit('move', from, to);
            }
        });
    });

    socket.on('save_game', function(gameId, player, fen) {
        var remoteGame = games[gameId];
        var id = remoteGame ? gameId : generateGameId();
        dao.saveGame(id, player, 'p2', fen, function() {
            socket.emit('save_game', id);
        });
    });

    socket.on('find_game', function(filterIn) {
        var filter = {};
        filter = setIfDefined(filterIn.player, filter, 'player1');
        filter = setIfDefined(filterIn.gameId, filter, 'gameId');
        dao.findGame(filter, function(err, games) {
            if(!games || games.length == 0) {
                return;
            }

            socket.emit('find_game', _.pluck(games, 'fen'));
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

var setIfDefined = function(par, obj, name) {
    if(par) {
        obj[name] = par;
    };

    return obj;
};

server.listen(port);
