jsx.declare('kingside.core');

jsx.require('jsx.util.Observer');

kingside.core.StateController = function() {
  var createGameObserver = new jsx.util.Observer();
  var startGameObserver = new jsx.util.Observer();
  return {
    startGame: function(white, black) {
      startGameObserver.notify(white, black);
    },
    onStartGame: function(fn) {
      startGameObserver.subscribe(fn);
    },
    createGame: function(fen) {
      createGameObserver.notify(fen);
    },
    onCreateGame: function(fn) {
      createGameObserver.subscribe(fn);
    }
  };
};
