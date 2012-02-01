var _ = require('underscore');
var dao = require('../dao/db').Db;
var Fen = require('../rex/Fen');

var GameService = function() {};

var games = {};

GameService.prototype.push = function(gameId) {
    games[gameId] = new Fen().toString();
};

GameService.prototype._getFenString = function(gameId, from, to) {
    var fen = new Fen(games[gameId]);
    fen.move(from, to);
    return fen.toString();
};

GameService.prototype.saveGame = function(from, to, gameId, game) {
    try {
        var fenString = this._getFenString(gameId, from, to);
        var game = {gameId: gameId, w: game.w, b: game.b, fen: fenString};
        dao.findGame(game, function(games){
            if(_.isEmpty(games)) {
                dao.saveGame(game);
            } else {
                dao.updateGame(game);
            }
        });
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