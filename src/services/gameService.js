var _ = require('underscore');
var dao = require('../dao/db').Db;
var Fen = require('../rex/Fen');

var GameService = function() {
    this._games = {}; //Should be stored in the db
};

GameService.prototype.push = function(gameId) {
    this._games[gameId] = new Fen().toString();
};

GameService.prototype._getFenString = function(gameId, from, to) {
    var fen = new Fen(this._games[gameId]);
    fen.move(from, to);
    return fen.toString();
};

GameService.prototype.saveGame = function(gameId, gameIn) {
    try {
        var fenString = Fen.initString;
        var game = {gameId: gameId, w: gameIn.w, b: gameIn.b, fen: fenString};
        dao.saveGame(game);
    } catch (e) {
        console.error('Invalid move', from, to, e);
    }
};

GameService.prototype.updateGame = function(from, to, gameId, gameIn) {
    try {
        var fenString = this._getFenString(gameId, from, to);
        var game = {gameId: gameId, w: gameIn.w, b: gameIn.b, fen: fenString};
        this._games[gameId] = fenString;
        dao.updateGame(game);
    } catch (e) {
        console.error('Invalid move', from, to, e);
    }
};

GameService.prototype.findUserGames = function(user, cb) {
    cb = cb || function() {};
    dao.findUserGames(user, function(err, res) {
        if(err) {
            console.error('Could not find users games', user, err);
        }
        cb(res);
    });
};

GameService.prototype.setDao = function(inDao) {
    dao = inDao;
};

exports.GameService = new GameService();