var _ = require('underscore');
var dao = require('../dao/db').Db;
var Fen = require('../rex/Fen');

var GameService = function() {
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

GameService.prototype.updateGame = function(from, to, game) {
    try {
        var fen = new Fen(game.fen);
        fen.move(from, to);
        game.fen = fen.toString();
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

GameService.prototype.getGameById = function(id, cb) {
    cb = cb || function() {};
    dao.findGame({gameId: id}, function(err, res) {
        if(err) {
            console.error('error fetching game', data, err);
        }
        console.log('got', typeof res, res);
        cb(res[0]);
    });
};

GameService.prototype.setDao = function(inDao) {
    dao = inDao;
};

exports.GameService = new GameService();