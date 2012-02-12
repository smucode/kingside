var _ = require('underscore');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var db = require('./db');

GameDao = function() {};

GameDao._schema = new Schema({
    gameId: {type: String},
    w: {type: String},
    b: {type: String},
    fen: {type: String},
    date: {type: Date, 'default': Date.now},
    moves: {type: Array}
});

GameDao.prototype._gameModel = mongoose.model('Game', GameDao._schema);

GameDao.prototype.saveGame = function(data, cb) {
    cb = cb || function() {};
    var game = new this._gameModel(data);
    return game.save(function(err){
        if(err) {
            console.error('Could not persist game', data);
            cb(false);
         }
         cb(true);
    });
};

GameDao.prototype.updateGame = function(data, cb) {
    cb = cb || function(){};
    var query = {gameId: data.gameId};
    this._gameModel.update(query, {fen: data.fen, moves: data.moves}, function(err, data) {
        if(err) {
            console.error('Could not search for game', err);
        }
        cb(err, data);
    });
};

GameDao.prototype.findGame = function(data, cb) {
    this._gameModel.find(data, function(err, data) {
        if(err) {
            console.error('Could not search for game', err);
        }
        var game;
        if(data) {
            game = _.first(data);
        }
        cb(err, game);
    });
};

GameDao.prototype.findUserGames = function(user, cb) {
    if(!user) {
        console.error('User must be defined in order to find its games');
        return;
    }
    this._gameModel.find({$or: [{w: user}, {b: user}]}, cb);
};

GameDao.prototype.removeGames = function(key, cb) {
    this.findGame(key, function(err, games) {
        if(err) {
            console.log('Could not remove games');
            cb();
        }
        _.each(games, function(game) {
            game.remove();
        }, this);
        cb();
    });
};

exports.GameDao = new GameDao();

