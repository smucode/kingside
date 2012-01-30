var vows = require('vows');
var assert = require('assert');
var service = require('../gameService').GameService;

service.setDao({
    saveGame: function() {},
    findUserGames: function() {}
});

vows.describe('db').addBatch({
    'save game' : {
        'save game triggers dao' : function() {
            var daoCalled;
            service.setDao({
                saveGame: function(id, w, b, fen) {
                    daoCalled = true;
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