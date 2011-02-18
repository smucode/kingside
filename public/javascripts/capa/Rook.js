jsx.declare('capa');

capa.Rook = function(color, pos, board) {
  this.pos = pos;
  this.board = board;
  this.color = color;
  this.moves = [];
};

capa.Rook.prototype = new capa.Movable();

capa.Rook.prototype.calculateMoves = function(args) {
  this.addDirectionalMoves(this.MOVES, args.checks || [], args.attacks || [], args.pins || [], args.legal);
};

capa.Rook.prototype.MOVES = [1, -1, 16, -16];
