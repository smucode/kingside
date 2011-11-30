var __ = require('underscore');

var King = function(idx, color, board) {
	this.idx = idx;
	this.color = color;
	this.board = board;
	this.moves = [];
};

King.prototype.calculate = function() {
	__.each(this.OFFSETS, function(offset) {
		var move = this.idx + offset;
		if (this.board.isOnBoard(move)) {
			this.moves.push(move);
		}
	}, this);
};

King.prototype.OFFSETS = [-1, 1, 16 - 1, 16, 16 + 1, -16 - 1, -16, -16 + 1];

exports.King = King;
