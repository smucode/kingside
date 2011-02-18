jsx.declare('capa');

capa.Knight = function(color, pos, board) {
  this.pos = pos;
  this.board = board;
  this.color = color;
  this.moves = [];
};

capa.Knight.prototype = new capa.Movable();
  
capa.Knight.prototype.calculateMoves = function(args) {
  checks = args.checks || [];
  attacks = args.attacks || [];
  
  var that = this;
  _.each(this.MOVES, function(offset) {
    var move = that.pos + offset;
    if (that.isLegalMove(move)) {
      that.moves.push(move);
      if (that.isOpponentKing(move)) {
        checks.push([that.pos]);
      }
    }
    if (!that.isOB(move)) {
      attacks.push(move);
    }
  });
  if (args.legal) {
    this.moves = _.intersect(this.moves, args.legal);
  }
};

capa.Knight.prototype.MOVES = [16 - 2, 16 + 2, 32 - 1, 32 + 1, -16 - 2, -16 + 2, -32 - 1, -32 + 1];
