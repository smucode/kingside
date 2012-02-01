var vows = require('vows');
var assert = require('assert');
var service = require('../gameService').GameService;

service.setDao({
    saveGame: function() {},
    updateGame: function() {},
    findGame: function() {},
    findUserGames: function() {}
});

vows.describe('db').addBatch({
    'save game' : {
        'existing game is updated' : function() {
            var saveCalled = false, updateCalled = false;
            service.setDao({
                saveGame: function() {
                    saveCalled = true;
                },
                updateGame: function() {
                    updateCalled = true;
                },
                findGame: function(game, cb) {
                    cb([game]);
                }
            });
            var gameId = 'id';
            service.push(gameId);
            service.saveGame('a2', 'a4', gameId, {w: 'white', b:'black'});
            assert.isFalse(saveCalled);
            assert.isTrue(updateCalled);
        },
        'saving games calles dao' : function() {
            var daoCalled = false;
            service.setDao({
                saveGame: function(id, w, b, fen) {
                    daoCalled = true;
                },
                findGame: function(game, cb) {
                    cb([]);
                }
            });
            var gameId = 'id';
            service.push(gameId);
            service.saveGame('a2', 'a4', gameId, {w: 'white', b:'black'});
            assert.isTrue(daoCalled);
        },
        'save game validates moves' : function() {
            var gameId = 'id';
            service.push(gameId);
            assert.throws(service.saveGame('a2', 'a5', gameId, {w: 'white', b:'black'}));
        },
        'find users games calles dao': function() {
            var lookingForUser;
            service.setDao({
                findUserGames: function(user, cb) {
                    lookingForUser = user;
                }
            });
            var user = 'testur@gmail.com';
            service.findUserGames(user);
            assert.equal(lookingForUser, user);
        }
    }

})["export"](module);