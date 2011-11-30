var __ = require('underscore');

var Knight = function(idx, color, board) {
	this.idx = idx;
	this.color = color;
	this.board = board;
	this.moves = [];
};

Knight.prototype.calculate = function() {
	__.each(this.OFFSETS, function(offset) {
		var move = this.idx + offset;
		if (this.board.isOnBoard(move)) {
			this.moves.push(move);
		}
	}, this);
};

Knight.prototype.OFFSETS = [16 - 2, 16 + 2, 32 - 1, 32 + 1, -16 - 2, -16 + 2, -32 - 1, -32 + 1];

exports.Knight = Knight;
