var dao = require('../dao/db').Db;
var Fen = require('../rex/Fen');

var GameService = function() {};

var games = {};

GameService.prototype.push = function(gameId) {
    games[gameId] = new Fen().toString();
};

GameService.prototype.saveGame = function(from, to, gameId, game) {
    try {
        var fen = new Fen(games[gameId]);
        fen.move(from, to);
        dao.saveGame(gameId, game.w, game.b, fen.toString());
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