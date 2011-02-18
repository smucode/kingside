jsx.declare('capa');

capa.Bishop = function(color, pos, board) {
  this.pos = pos;
  this.board = board;
  this.color = color;
  this.moves = [];
};

capa.Bishop.prototype = new capa.Movable();

capa.Bishop.prototype.calculateMoves = function(args) {
  this.addDirectionalMoves(this.MOVES, args.checks || [], args.attacks || [], args.pins || [], args.legal);
};

capa.Bishop.prototype.MOVES = [16 - 1, 16 + 1, -16 - 1, -16 + 1];
