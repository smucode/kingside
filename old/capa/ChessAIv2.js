jsx.declare('capa');

jsx.require('capa.Board');

capa.ChessAIv2 = function(board, color) {
  var getRandom = function(arr) {
    var rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
  };

  var generateMove = function() {
    var moves = [];
    _.each(board.getPieces({color: color}), function(p) {
      if (p.moves) {
        _.each(p.moves, function(move) {
          moves.push([p.pos, move]);
        });
      }
    });
    if (moves.length === 0) {
      console.error('found no moves')
    } else {
      return getRandom(moves);
    }
  };

  board.onEvent(function(evt) {
    if (evt.turn == color) {
      window.setTimeout(function() {
        var move = generateMove();
        if (move) {
          board.move.apply(null, move);
        }
      }, 1);
    }
  });

};