var buster = require("buster");
var service = require('../gameService').GameService;

service.setDao({
    saveGame: function() {},
    updateGame: function() {},
    findGame: function() {},
    findUserGames: function() {}
});

buster.testCase('save game', {
  'testur' : function() {
      assert(true); 
  },
  'existing game is updated' : function() {
      var updateCalled;
      service.setDao({
          updateGame: function() {
              updateCalled = true;
          }
      });
      var gameId = 'id';
      service.updateGame('a2', 'a4', {w: 'white', b:'black', moves: []});
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
      service.saveGame(gameId, {w: 'white', b:'black'});
      assert(daoCalled);
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
      assert.equals(lookingForUser, user);
  }
});
