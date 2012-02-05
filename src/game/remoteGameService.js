var _ = require('underscore');
var auth = require('../auth/auth').auth;
var util = require('..//util/httputils');
var Event = require('../event/event');

var io = require('../io/io').io;
var gameService = require('../services/gameService').GameService;

var RemoteGameService = function() {
    this._io = io;
    this._sockets = {};
    this._games = {};
    this._gameRequests = [];
    this._listeners = [];
    this._event = new Event();
    
    this.onMove(function(from, to, gameId, game) {
        console.log('from', from, 'to', to, 'gameId', gameId, 'game', game);
        gameService.updateGame(from, to, gameId, game);
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
        var gameId = this._generateGameId();

        var socket = this._sockets[whiteUser];
        socket.emit('game_ready', 'w', gameId, blackUser);

        socket = this._sockets[blackUser];
        socket.emit('game_ready', 'b', gameId, whiteUser);

        var game = {
            w: whiteUser,
            b: blackUser
        };
        this._games[gameId] = game;

        gameService.saveGame(gameId, game);

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

RemoteGameService.prototype._fireEvent =  function(from, to, gameId, game) {
    this._event.fire('move', from, to, gameId, game);
};

RemoteGameService.prototype._listenAfterMove = function(socket, user) {
    var that = this;
    socket.on('move', function(gameId, from, to) {
        var game = that._games[gameId];
        _.each(game, function(email, side) {
            if (user.email != email) {
                var otherSocket = that._sockets[email];
                otherSocket.emit('move', from, to);
            }
        });
        that._fireEvent(from, to, gameId, game);
    });
};

RemoteGameService.prototype._listenAfterRequestGame = function(socket) {
    var that = this;
    socket.on('request_game', function() {
        if(user) {
            that._sockets[user.email] = socket;
            that._gameRequests.push(user.email);
            that.processGameRequests();
        }
    });
};

RemoteGameService.prototype.listen = function() {
    var that = this;
    this._io.sockets.on('connection', function (socket) {
        var sid = util.parseCookie(socket.handshake.headers.cookie)['express.sid'];
        var user = auth.getUser(sid);
        that._listenAfterRequestGame(socket);
        that._listenAfterMove(socket, user);
    });
};

exports.RemoteGameService = RemoteGameService;