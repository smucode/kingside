var buster = require("buster");
var service = require('../gameService').GameService;

service.setDao({
    saveGame: function() {},
    updateGame: function() {},
    findGame: function() {},
    findUserGames: function() {}
});

buster.testCase('game service', {
  'existing game is updated' : function() {
      var updateCalled;
      service.setDao({
          updateGame: function() {
              updateCalled = true;
          }
      });
      var gameId = 'id';
      service.update('a2', 'a4', {w: 'white', b:'black', moves: []});
      assert(updateCalled);
  },
  'saving games calles dao' : function() {
      var daoCalled;
      service.setDao({
          saveGame: function(id, w, b, fen) {
              daoCalled = true;
          }
      });
      var gameId = 'id';
      service.create(gameId, {w: 'white', b:'black'});
      assert(daoCalled);
  },
  'find users games calles dao': function(done) {
      service.setDao({
          findUserGames: function(user, cb) {
              cb();
          }
      });
      var user = 'testur@gmail.com';
      service.findUserGames(user, function(err, users) {
          assert(true);
          done();
      });
    },
    'find user returns a result': function(done) {
        var testUser = {name: 'testur', email: 'testur@testur.net'};
         service.setDao({
            findUserGames: function(user, cb) {
                cb(null, [testUser]);
            }
         });
        service.findUserGames('userId', function(users) {
           assert.equals(users, [testUser]);
           done();
        });
    },
    'get game by calls dao': function(done) {
        service.setDao({
            findGame: function(id, cb) {
                cb(null, [{name: 'user'}]);
            }
         });
        service.getGameById('gameId', function(game) {
           assert(true);
           done();
        });
    },
    'get game handles dao error': function(done) {
        service.setDao({
            findGame: function(id, cb) {
                cb('error', null);
            }
         });
        service.getGameById('gameId', function(game) {
           assert.isNull(game);
           done();
        });
    
    }

});
