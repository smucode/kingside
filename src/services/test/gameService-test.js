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
            var updateCalled = false;
            service.setDao({
                updateGame: function() {
                    updateCalled = true;
                }
            });
            var gameId = 'id';
            service.updateGame('a2', 'a4', gameId, {w: 'white', b:'black'});
            assert.isTrue(updateCalled);
        },
        'saving games calles dao' : function() {
            var daoCalled = false;
            service.setDao({
                saveGame: function(id, w, b, fen) {
                    daoCalled = true;
                }
            });
            var gameId = 'id';
            service.saveGame(gameId, {w: 'white', b:'black'});
            assert.isTrue(daoCalled);
        },
        'save game validates moves' : function() {
            var gameId = 'id';
            assert.throws(service.saveGame(gameId, {w: 'white', b:'black'}));
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