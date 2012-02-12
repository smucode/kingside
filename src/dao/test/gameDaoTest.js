var _ = require('underscore');
var buster = require('buster');
var gameDaoMock = require('../gameDaoMock.js').GameDaoMock;


var assertPersisted = function(expected) {
   gameDaoMock.findGame({gameId: expected.gameId}, function(err, game) {
       assert.equals(expected, game);
   });
};
var testCase = buster.testCase("game dao", {
    setUp: function() {
        gameDaoMock.init();
    },
    'has a save game' : function() {
        assert(gameDaoMock.saveGame);
    },
    'mock has a find game function' : function() {
        assert(gameDaoMock.findGame);
    },
    'mock has a update game function' : function() {
        assert(gameDaoMock.updateGame);
    },
    'mock has a find user games function' : function() {
        assert(gameDaoMock.findUserGames);
    },
    'save games accept data and calls the callback' : function() {
        gameDaoMock.saveGame({}, function(saved) {
            assert(saved);
        });
    },
    'game can be read out after save' : function() {
        var testGame = {gameId: 'id'};
        gameDaoMock.saveGame(testGame, function(saved) {
            assertPersisted(testGame);  
        });
    },
    'when saved multiple games, game can be read' : function() {
        var testGame = {gameId: 'id', w: 'user'};
        var testGame1 = {gameId: 'id1', w: 'user1'};
        gameDaoMock.saveGame(testGame);
        gameDaoMock.saveGame(testGame1);
        assertPersisted(testGame);  
    },
    'update game updates the game object' : function() {
        var testGame = {gameId: 'id', w: 'user'};
        gameDaoMock.saveGame(testGame);
        var updatedGame = {gameId: 'id', w: 'updateUser'}; 
        gameDaoMock.updateGame(updatedGame);
        assertPersisted(updatedGame);  
    },
    'find user games find games where user is white': function() {
        var testGame = {gameId: 'id', w: 'user1'};
        gameDaoMock.saveGame(testGame);
        gameDaoMock.findUserGames('user1', function(err, games) {
            assert.equals(_.first(games), testGame);
        });
        
    }
});
