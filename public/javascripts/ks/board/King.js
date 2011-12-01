var __ = require('underscore');
var Piece = require('./Piece').Piece;

var King = function(idx, color, board) {
	this.idx = idx;
	this.color = color;
	this.board = board;
	this.moves = [];
};

King.prototype = new Piece();

King.prototype.calculate = function() {
	__.each(this.DIRECTIONS, function(direction) {
		var target = this.idx + direction;
		if (this.canMoveTo(target) || this.canCapture(target)) {
			this.moves.push(target);
		}
	}, this);
};

King.prototype.DIRECTIONS = [-1, 1, 16 - 1, 16, 16 + 1, -16 - 1, -16, -16 + 1];

exports.King = King;
