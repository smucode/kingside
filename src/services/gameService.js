var _ = require('underscore');
var dao = require('../dao/gameDao').GameDao;
var Fen = require('../rex/Fen');

var GameService = function() {
};

GameService.prototype.saveGame = function(gameId, gameIn) {
    try {
        var game = {
            moves: [],
            w: gameIn.w, 
            b: gameIn.b, 
            gameId: gameId, 
            fen: Fen.initString
        };
        dao.saveGame(game);
    } catch (e) {
        console.error('Invalid move', gameId, gameIn);
    }
};

GameService.prototype.updateGame = function(from, to, game, callback) {
    try {
        var fen = new Fen(game.fen);
        fen.move(from, to);
        game.fen = fen.toString();
        game.moves.push([from, to]);
        dao.updateGame(game, function(err, data) {
			callback(data);
		});
    } catch (e) {
        console.error('Invalid move', from, to, e);
		callback(game);
    }
};

GameService.prototype.findUserGames = function(user, cb) {
    cb = cb || function() {};
    dao.findUserGames(user, function(err, res) {
        if(err) {
            console.error('error fetching game', user, err);
        }
        cb(res);
    });
};

GameService.prototype.getGameById = function(id, cb) {
    cb = cb || function() {};
    dao.findGame({gameId: id}, function(err, res) {
        if(err) {
            console.error('error fetching game', err);
            cb(null);
            return;
        }
        cb(_.first(res));
    });
};

GameService.prototype.setDao = function(inDao) {
    dao = inDao;
};

exports.GameService = new GameService();
