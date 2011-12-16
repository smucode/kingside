jsx.declare('capa');

jsx.require('capa.Piece');
jsx.require('jsx.util.Observer');

// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

capa.Board = function(fen) { // fen or board array
  var PAWN = 1;
  var KNIGHT = 2;
  var KING = 3;
  var BISHOP = 5;
  var ROOK = 6;
  var QUEEN = 7;
  
  var WHITE = 1;
  var BLACK = -1;
  
  var CASTLE = { 2: 0, 6: 7, 114: 112, 118: 119 };
  var CASTLE_CANCEL = { 0: 'Q', 4: 'KQ', 7: 'K', 112: 'q', 116: 'kq', 119: 'k' };
  
  var turn, enpassant, castle, halfmoves;
  var ranks = '76543210';
  var files = 'abcdefgh';
  var board = new Array(128), cache = {};
  var eventObserver = new jsx.util.Observer();
  var map = {'r':-6,'b':-5,'n':-2,'k':-3,'q':-7,'p':-1,'R':6,'B':5,'N':2,'K':3,'Q':7,'P': 1};
  
  (function() {
    if (typeof(fen) == 'string') {
      var arr = fen.split(' ');
      _.each(arr[0].split('/'), function(rank, r) {
        var rankNo = parseInt(ranks[r], 10);
        var fileNo = 0;
        _.each(rank, function(sq, i) {
          if (isNaN(sq)) {
            var pos = (rankNo * 16) + fileNo++;
            board[pos] = map[sq];
          } else {
            fileNo += parseInt(sq, 10);
          }
        });
      });
      turn = arr[1] == 'w' ? 1 : -1;
      castle = _.without(arr[2], '');
      enpassant = arr[3];
      halfmoves = arr[4];
    } else {
      board = fen.board;
      turn = fen.turn;
      castle = [];
      enpassant = '';
      halfmoves = 0;
    }
  })();

  var getPieces = function(q) {
    q = q || {};
    var pieces = [];
    _.each(board, function(p, i) {
      if (p && (!q.color || (q.color == (p > 0 ? 1 : -1))) && (!q.type || (q.type == Math.abs(p)))) {
        pieces.push(getPiece(i));
      }
    });
    return pieces;
  };

  var getPiece = function(pos) {
    if (!cache[pos]) {
      var p = board[pos];
      if (p) {
        cache[pos] = createPiece(p, pos);
      }
    }
    return cache[pos];
  };
  
  var createPiece = function(p, pos) {
    return new capa.Piece(p, pos, board);
  };
  
  var calculateMoves = function(color) {
    cache = {}; // contains the created pieces, with created positions
    var pins = {}; // key = pos of pinned piece, val = arr of moves from pinner to king
    var checks = []; // array of checking pieces. consists of arrays of moves to king, where [0] is checking piece
    var attacks = []; // array of all squares that are attacked, including squares behind attacked king
    
    _.each(getPieces({color: (color * -1)}), function(piece) {
      piece.calculateMoves({
        pins: pins,
        checks: checks,
        attacks: attacks,
        enpassant: enpassant
      });
      piece.moves = [];
    });
    
    var num = 0;
    _.each(getPieces({color: color, type: KING}), function(king) {
      king.calculateMoves({illegal: attacks, castle: castle});
      num += king.moves.length;
    });
    
    _.each(getPieces({color: color}), function(piece) {
      if (!(piece instanceof capa.King)) {
        var pinmoves = pins[piece.pos];
        piece.calculateMoves({
          legal: (checks.length !== 0) ? _.flatten(checks).concat(pinmoves || []) : pinmoves,
          enpassant: enpassant
        });
        num += piece.moves.length;
      }
    });
    
    if (checks.length !== 0 && num === 0) {
      console.log('checkmate');
    } else if (checks.length !== 0) {
      console.log('check');
    } else if (num === 0) {
      console.warn('stalemate');
    }

  };
  
  var move = function(from, to) {
    turn = turn * -1;
    var evt = {type: 'move', from: from, to: to, turn: turn};
    
    // check the halfmove clock
    if (PAWN == board[from] || board[to]) {
      halfmoves = 0;
    } else {
      halfmoves++;
      if (halfmoves > 100) {
        turn = null;
        console.log('draw due to the 50 move rule');
      }
    }
    
    // handle castle move
    if (castle.length !== 0 && CASTLE_CANCEL[from]) {
      _.each(CASTLE_CANCEL[from], function(m) {
        castle = _.without(castle, m);
      });
    };
    
    // handle castle
    if (Math.abs(board[from]) == KING && Math.abs(from - to) == 2) {
      var color = board[from] > 0 ? 1 : -1;
      board[from + 1 * color] = board[CASTLE[to]];
      board[CASTLE[to]] = null;
      evt.castle = {
        from: CASTLE[to],
        to: from + 1 * color
      };
    }
    
    // handle enpassant move
    if (enpassant && enpassant == to) {
      var cap = to + 16 * board[from] * -1;
      board[cap] = null;
      evt.enpassant = cap;
    }

    // set enpassant flag
    if (PAWN == Math.abs(board[from]) &&  Math.abs(from - to) == 32) {
      enpassant = from + 16 * board[from];
    } else {
      enpassant = null;
    }

    // handle promotion
    if ((to <= 8 || to >= (16 * 7)) && Math.abs(board[from]) == PAWN) {
      board[to] = board[from] * 7;
      evt.promotion = true;
    } else {
      board[to] = board[from];
    }

    board[from] = null;
    calculateMoves(turn);
    eventObserver.notify(evt);
  };
  
  return {
    start: function() {
      calculateMoves(turn);
      eventObserver.notify({
        type: 'start', 
        turn: turn
      });
    },
    move: function(from, to) {
      move(from, to);
    },
    calculateMoves: function(color) {
      calculateMoves(color);
    },
    getMoves: function(pos) {
      var piece = getPiece(pos);
      return piece ? piece.moves : [];
    },
    getPieces: function(q) {
      return getPieces(q);
    },
    onEvent: function(fn) {
      eventObserver.subscribe(fn);
    }
  };
  
};
