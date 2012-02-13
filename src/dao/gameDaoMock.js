var _ = require('underscore');
    
GameDaoMock = function() {
    this.games = { 
        '42': {
            gameId: 42,
            moves: [],
            w: 'stig.murberg@gmail.com',
            b: 'fiskarsymjar@gmail.com',
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
        }
    };
};

GameDaoMock.prototype.saveGame = function(data, cb) {
    cb = cb || function() {};
    this.games[data.gameId] = data;
    cb(true);
};

GameDaoMock.prototype.updateGame = function(updatedGame, cb) {
    cb = cb || function() {};
    var id = updatedGame.gameId;
    var game = this.games[id]; 
    this.games[id] = _.extend(game, updatedGame);
    cb(true);
};

GameDaoMock.prototype.findGame = function(data, cb) {
    cb = cb || function() {};
    var game = this.games[data.gameId];
    if(!game) {
        cb('game not found', null);
    }
    cb(null, game);
};

GameDaoMock.prototype.findUserGames = function(userId, cb) {
    var games = _.filter(this.games, function(game, id) {
        return game.w == userId || game.b == userId;
    }); 
    cb(null, games);
};

GameDaoMock.prototype.init = function() {
    this.games = {};
};

exports.GameDaoMock = new GameDaoMock();
