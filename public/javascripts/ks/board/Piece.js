var __ = require('underscore');

var Piece = function() {
};

Piece.prototype.canMoveTo = function(idx) {
	return this.board.isOnBoard(idx);
};

exports.Piece = Piece;