var __ = require('underscore');
var Piece = require('./Piece').Piece;

var Knight = function(idx, color, board) {
	this.idx = idx;
	this.color = color;
	this.board = board;
	this.moves = [];
};

Knight.prototype = new Piece();

Knight.prototype.calculate = function() {
	__.each(this.DIRECTIONS, function(direction) {
		var target = this.idx + direction;
		if (this.canMoveTo(target) || this.canCapture(target)) {
			this.moves.push(target);
		}
	}, this);
};

Knight.prototype.DIRECTIONS = [16 - 2, 16 + 2, 32 - 1, 32 + 1, -16 - 2, -16 + 2, -32 - 1, -32 + 1];

exports.Knight = Knight;
