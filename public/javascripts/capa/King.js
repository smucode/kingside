jsx.declare('capa');

capa.King = function(color, pos, board) {
  this.pos = pos;
  this.board = board;
  this.color = color;
  this.moves = [];
};

capa.King.prototype = new capa.Movable();
  
capa.King.prototype.calculateMoves = function(args) {
  attacks = args.attacks || [];
  
  var that = this;
  _.each(this.MOVES, function(offset) {
    var move = that.pos + offset;
    if (that.isLegalMove(move)) {
      that.moves.push(move);
    }
    if (!that.isOB(move)) {
      attacks.push(move);
    }
  });
  
  if (args.illegal) {
    var xargs = args.illegal.slice(0);
    xargs.unshift(this.moves);
    this.moves = _.without.apply(null, xargs);
  }

  // castle  
  _.each([1, -1], function(direction) {

    if (args.castle) {
      if (_.indexOf(args.castle, that.CASTLE[that.pos + direction]) == -1) {
        return;
      }
    }
    
     var i = 1;
     while(true) {
       var next = that.pos + (direction * i++);
       if (that.isOB(next) || (args.illegal && _.indexOf(args.illegal, next) != -1)) {
         break;
       }
       if (that.isEmpty(next)) {
         continue;
       }
       if (that.board[next] == (6 * that.color)) {
         that.moves.push(that.pos + (direction * 2));
       }
       break;
     }
  });
  
};

capa.King.prototype.MOVES = [-1, 1, 16 - 1, 16, 16 + 1, -16 - 1, -16, -16 + 1];

capa.King.prototype.CASTLE = { 3: 'Q', 5: 'K', 115: 'q', 117: 'k' };
