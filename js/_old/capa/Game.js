jsx.declare('capa');

jsx.require('capa.Board');
jsx.require('capa.ChessAI');
jsx.require('capa.ChessAIv2');
jsx.require('jsx.util.Observer');

capa.Game = function (fen) {
  var board = new capa.Board(fen);
  var eventObserver = new jsx.util.Observer();
  var turn, castle, enPassent, halfMoves, wholeMoves;
  var posIdxMap = {'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7};
  
  (function() {
    var arr = fen.split(' ');
    turn = fen[1];
    castle = fen[2];
    enPassent = fen[3];
    halfMoves = fen[4];
    wholeMoves = fen[5];
  })();

  var getArrayIndex = function(square) {
    var idx = (parseInt(square[1], 10) - 1) * 16;
    idx += posIdxMap[square[0]];
    return idx;
  };
  
  var getSquare = function(idx) {
    var file = 'abcdefgh'.charAt(idx % 16);
    var rank = Math.floor((idx / 16) + 1);
    return file + rank;
  };
  
  return {
    start: function(white, black) {
      board.onEvent(function(evt) {
        if (evt.type == 'move') {
          evt.toIdx = evt.to;
          evt.to = getSquare(evt.to);
          evt.fromIdx = evt.from;
          evt.from = getSquare(evt.from);
          if (evt.enpassant) {
            evt.enpassant = getSquare(evt.enpassant);
          }
          if (evt.castle) {
            evt.castle.to = getSquare(evt.castle.to);
            evt.castle.from = getSquare(evt.castle.from);
          }
          eventObserver.notify(evt);
        }
      });
      if (white == 'c') {
        new capa.ChessAI(board, 1);
      }
      if (black == 'c') {
        new capa.ChessAIv2(board, -1);
      }
      board.start();
    },
    move: function(from, to) {
      board.move(getArrayIndex(from), getArrayIndex(to));
    },
    onEvent: function(fn) {
      eventObserver.subscribe(fn);
    },
    getMoves: function(pos) {
      var arr = board.getMoves(getArrayIndex(pos)) || [];
      arr = arr.slice(0);
      _.each(arr, function(pos, i) {
        arr[i] = getSquare(pos);
      });
      return arr;
    }
  };
};

