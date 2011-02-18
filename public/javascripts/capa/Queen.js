jsx.declare('capa');

capa.Queen = function(color, pos, board) {
  this.pos = pos;
  this.board = board;
  this.color = color;
  this.moves = [];
};

capa.Queen.prototype = new capa.Movable();

capa.Queen.prototype.calculateMoves = function(args) {
  this.addDirectionalMoves(this.MOVES, args.checks || [], args.attacks || [], args.pins || [], args.legal);
};

capa.Queen.prototype.MOVES = [1, -1, 16, -16, 16 - 1, 16 + 1, -16 - 1, -16 + 1];
