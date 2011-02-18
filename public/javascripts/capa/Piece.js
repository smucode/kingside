jsx.declare('capa');

jsx.require('capa.Pawn');
jsx.require('capa.King');
jsx.require('capa.Rook');
jsx.require('capa.Queen');
jsx.require('capa.Knight');
jsx.require('capa.Bishop');

capa.Piece = function(type, pos, board) {
  
  var PAWN = 1;
  var KNIGHT = 2;
  var KING = 3;
  var BISHOP = 5;
  var ROOK = 6;
  var QUEEN = 7;
  
  var WHITE = 1;
  var BLACK = -1;
  
  var color = type > 0 ? 1 : -1;
  switch(Math.abs(type)) {
    case PAWN:
      return new capa.Pawn(color, pos, board);
    case KING:
      return new capa.King(color, pos, board);
    case ROOK:
      return new capa.Rook(color, pos, board);
    case QUEEN:
      return new capa.Queen(color, pos, board);
    case KNIGHT:
      return new capa.Knight(color, pos, board);
    case BISHOP:
      return new capa.Bishop(color, pos, board);
    default: 
      throw 'cannot create piece. type = ' + type;
  }
}

/* Movable */

capa.Movable = function() {};

capa.Movable.prototype.isLegalCapture = function(move) {
  return !this.isOB(move) && !this.isEmpty(move) && !this.isSameColor(move);
};

capa.Movable.prototype.isLegalMove = function(move) {
  return !this.isOB(move) && (this.isEmpty(move) || !this.isSameColor(move));
};

capa.Movable.prototype.isOB = function(move) {
  return (move & 0x88) !== 0;
};

capa.Movable.prototype.isEmpty = function(move) {
  return !this.board[move];
};

capa.Movable.prototype.isOpponentKing = function(move) {
  var king = this.color * -1 * 3;
  return this.board[move] == king;
};

capa.Movable.prototype.isSameColor = function(move) {
  var piece = this.board[move];
  if (piece) {
    var color = piece > 0 ? 1 : -1;
    return color == this.color;
  }
  return false;
};

capa.Movable.prototype.addDirectionalMoves = function(matrix, checks, attacks, pins, legal) {
  var that = this;
  _.each(matrix, function(direction) {
    var tmpchecks = [that.pos];
    for (var i = 1; i < 8; i++) {
      var move = that.pos + direction * i;
      if (that.isOB(move)) {
        break;
      }
      if (that.isEmpty(move)) {
        that.moves.push(move);
        attacks.push(move);
        tmpchecks.push(move);
        continue;
      } 
      attacks.push(move);
      if (!that.isSameColor(move)) {
        that.moves.push(move);
        if (that.isOpponentKing(move)) {
          checks.push(tmpchecks.slice(0));
          while(i++) {
            move = that.pos + direction * i;
            if (!that.isOB(move)) {
              if (that.isEmpty(move)) {
                attacks.push(move);
                continue;
              } else if (that.isSameColor(move)) {
                attacks.push(move);
              }
            }
            break;
          }
        } else if (!that.isSameColor(move)) {
          var pinned = move;
          while(i++) {
            move = that.pos + direction * i;
            if (that.isOB(move)) {
              break;
            }
            if (that.isEmpty(move)) {
              continue;
            }
            if (that.isOpponentKing(move)) {
              pins[pinned] = tmpchecks.slice(0);
            }
            break;
          }
        }
      }
      break;
    }
  });
  if (legal) {
    this.moves = _.intersect(this.moves, legal);
  }
};

  
