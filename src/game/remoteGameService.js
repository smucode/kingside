var _ = require('underscore');
var cache = require('../cache/userCache').UserCache;
var util = require('../util/httputils');
var Event = require('../event/event');
var io = require('../io/io').io;
var gameService = require('../services/gameService').GameService;
var Fen = require('../rex/fen');

var RemoteGameService = function() {
    this._io = io;
    this._sockets = {};
    this._gameRequests = [];
    this._listeners = [];
    this._event = new Event();
    
    this._listen();
};

RemoteGameService.prototype._generateGameId = function() {
    return Math.floor(Math.random() * 1000000000000000).toString(16);
};

RemoteGameService.prototype.processGameRequests = function() {
    var whiteUser = this._gameRequests.pop();
    var blackUser = this._gameRequests.pop();
    if (whiteUser && blackUser) {
        var game = {
            gameId: this._generateGameId(),
            w: whiteUser,
            b: blackUser,
            fen: Fen.initString
        };

        var socket = this._sockets[whiteUser];
        socket.emit('game_ready', game);
        
        socket = this._sockets[blackUser];
        socket.emit('game_ready', game);

        gameService.create(game.gameId, game);

    } else {
        if (whiteUser) this._gameRequests.push(whiteUser);
        if (blackUser) this._gameRequests.push(blackUser);
    }
};

RemoteGameService.prototype._listenAfterMove = function(socket, user) {
    var that = this;
    socket.on('move', function(gameId, from, to) {
        gameService.getGameById(gameId, function(game) {
            var otherSocket = that._sockets[(game.w == user.email) ? game.b : game.w];
            gameService.update(from, to, game, function() {
                if (otherSocket) {
                    otherSocket.emit('move', game.gameId, from, to);
                }
				socket.emit('move', game.gameId, from, to);
			});
        });
    });
};

RemoteGameService.prototype._listenAfterRequestGame = function(socket, user) {
    var that = this;
    socket.on('request_game', function() {
        if(user && that._gameRequests.indexOf(user.email) === -1) {
            that._gameRequests.push(user.email);
            that.processGameRequests();
        }
    });
};

RemoteGameService.prototype._listen = function() {
    var that = this;
    this._io.sockets.on('connection', function (socket) {
        var sid = that._getSid(socket);
        var user = cache.get(sid);
        if (user) {
            that._sockets[user.email] = socket;
            that._listenAfterRequestGame(socket, user);
            that._listenAfterMove(socket, user);
        }
    });
};

RemoteGameService.prototype._getSid = function(socket) {
    return util.parseCookie(socket.handshake.headers.cookie)['express.sid'];
};

exports.RemoteGameService = RemoteGameService;
