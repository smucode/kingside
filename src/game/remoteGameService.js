var Io = require('socket.io');
var auth = require('../auth/auth').auth;
var util = require('..//util/httputils');

var sockets = {};
var games = {};
var gameRequests = [];
var io;

var RemoteGameService = function(inIo) {
    io = inIo;
};

RemoteGameService.prototype._generateGameId = function() {
    return Math.floor(Math.random() * 1000000000000000).toString(16);
};

RemoteGameService.prototype.processGameRequests = function() {
    var whiteUser = gameRequests.pop();
    var blackUser = gameRequests.pop();
    if (whiteUser && blackUser) {
        var gameId = this._generateGameId();

        var socket = sockets[whiteUser];
        socket.emit('game_ready', 'w', gameId, blackUser);

        socket = sockets[blackUser];
        socket.emit('game_ready', 'b', gameId, whiteUser);

        games[gameId] = {
            w: whiteUser,
            b: blackUser
        };

    } else {
        if (whiteUser) {
            gameRequests.push(whiteUser);
        }
        if (blackUser) {
            gameRequests.push(blackUser);
        }
    }
};

RemoteGameService.prototype.listen = function() {
    var that = this;
    io.sockets.on('connection', function (socket) {
        socket.on('request_game', function() {
            var sid = util.parseCookie(socket.handshake.headers.cookie)['express.sid'];
            console.log('sid', socket.handshake.headers);
            var user = auth.getUser(sid);
            sockets[user.email] = socket;
            if(user) {
                console.log('request_game', user);
                gameRequests.push(user.email);
                that.processGameRequests();
            }
        });
    });
};

exports.RemoteGameService = RemoteGameService;