var _ = require('underscore');
    
GameDaoMock = function() {
    this.games = {};
};

GameDaoMock.prototype.saveGame = function(data, cb) {
    console.log('mock save', data);
    cb = cb || function() {};
    this.games[data.gameId] = data;
    cb(true);
};

GameDaoMock.prototype.updateGame = function(updatedGame, cb) {
    console.log('mock update', updatedGame);
    cb = cb || function() {};
    var id = updatedGame.gameId;
    var game = this.games[id]; 
    this.games[id] = _.extend(game, updatedGame);
    cb(true);
};

GameDaoMock.prototype.findGame = function(data, cb) {
    console.log('mock find', data);
    cb = cb || function() {};
    var game = this.games[data.gameId];
    if(!game) {
        cb('game not found', null);
    }
    cb(null, game);
};

GameDaoMock.prototype.findUserGames = function(userId, cb) {
    console.log('mock find users', userId);
    var games = _.filter(this.games, function(game, id) {
        return game.w == userId || game.b == userId;
    }); 
    cb(null, games);
};

GameDaoMock.prototype.init = function() {
    this.games = {};
};

exports.GameDaoMock = new GameDaoMock();
