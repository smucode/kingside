var __ = require('underscore');

var Piece = function() {
};

Piece.prototype.canCapture = function(idx) {
	var piece = this.board._getPieceAt(idx);
	return piece && piece.color != this.color;
};

Piece.prototype.canMoveTo = function(idx) {
	var piece = this.board._getPieceAt(idx);
	return this.board.isOnBoard(idx) && !piece;
};

Piece.prototype.addDirectionalMoves = function(directions) {
	__.each(directions, function(direction) {
		this._addNextDirectionalMove(direction);
	}, this);
};

Piece.prototype._addNextDirectionalMove = function(direction, offset) {
	offset = offset || 1;
	var move = this.idx + (offset * direction);
	if (this.board.isOnBoard(move)) {
		this.moves.push(move);
		this._addNextDirectionalMove(direction, ++offset);
	}
};

exports.Piece = Piece;