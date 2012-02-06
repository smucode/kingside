var _ = require('underscore');
var auth = require('../auth/auth').auth;
var util = require('../util/httputils');
var Event = require('../event/event');
var io = require('../io/io').io;
var gameService = require('../services/gameService').GameService;
var Fen = require('../rex/fen');

var RemoteGameService = function() {
    this._io = io;
    this._sockets = {};
    this._games = {};
    this._gameRequests = [];
    this._listeners = [];
    this._event = new Event();
    
    this.onMove(function(from, to, game) {
        gameService.updateGame(from, to, game);
    });

    this.listen();
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

        this._games[game.gameId] = game;

        gameService.saveGame(game.gameId, game);

    } else {
        if (whiteUser) {
            this._gameRequests.push(whiteUser);
        }
        if (blackUser) {
            this._gameRequests.push(blackUser);
        }
    }
};


RemoteGameService.prototype.onMove = function(f) {
    this._event.addListener('move', f);
};

RemoteGameService.prototype._fireEvent =  function(from, to, game) {
    this._event.fire('move', from, to, game);
};

RemoteGameService.prototype._listenAfterMove = function(socket, user) {
    var that = this;
    socket.on('move', function(gameId, from, to) {
        gameService.getGameById(gameId, function(game) {
            var otherSocket = that._sockets[(game.w == user.email) ? game.b : game.w];
            if (otherSocket) {
                otherSocket.emit('move', from, to);
            }
            that._fireEvent(from, to, game);
        });
    });
};

RemoteGameService.prototype._listenAfterRequestGame = function(socket, user) {
    var that = this;
    socket.on('request_game', function() {
        if(user) {
            that._gameRequests.push(user.email);
            that.processGameRequests();
        }
    });
};

RemoteGameService.prototype.listen = function() {
    var that = this;
    this._io.sockets.on('connection', function (socket) {
        var sid = that._getSid(socket);
        var user = auth.getUser(sid);
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
