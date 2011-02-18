jsx.declare('capa');

capa.Pawn = function(color, pos, board) {
  this.pos = pos;
  this.board = board;
  this.color = color;
  this.moves = [];
};

capa.Pawn.prototype = new capa.Movable();

capa.Pawn.prototype.calculateMoves = function(args) {
  var legal = args.legal;
  var checks = args.checks || [];
  var attacks = args.attacks || [];
  
  var move = this.pos + (this.color * 16);
  if (!this.board[move]) {
    this.moves.push(move);
    if ((this.pos >= 16 && this.pos < 16 + 8) || (this.pos >= 96 && this.pos < 96 + 8)) {
      move = this.pos + (this.color * 32);
      if (!this.board[move]) {
        this.moves.push(move);
      }
    }
  }
  
  var that = this;
  _.each([1, -1], function(direction) {
    var move = that.pos + (that.color * 16) + direction;
    if (args.enpassant && move == args.enpassant) {
      that.moves.push(move);
    }
    if (that.isLegalCapture(move)) {
      that.moves.push(move);
      if (that.isOpponentKing(move)) {
        checks.push([that.pos]);
      }
    }
    if (!that.isOB(move)) {
      attacks.push(move);
    }
  });
  
  if (legal) {
    this.moves = _.intersect(legal, this.moves);
  }
};