var __ = require('underscore');
var Piece = require('./Piece').Piece;

var Pawn = function(idx, color, board) {
	this.idx = idx;
	this.color = color;
	this.board = board;
	this.moves = [];
};

Pawn.prototype = new Piece();

Pawn.prototype.calculate = function() {
	this._addRegularMoves();
	this._addCaptureMoves();
	this._removePinnedMoves();
};

Pawn.prototype.canCaptureEnPassant = function(idx) {
	return this.board.isEnPassant(idx); 
};

Pawn.prototype._addRegularMoves = function() {
	var square = this.idx + (this.color * 16);
	if(this.board.isEmpty(square)) {
		this.moves.push(square);
		if((this.idx >= 16 && this.idx < 16 + 8) || (this.idx >= 96 && this.idx < 96 + 8)) {
			square = this.idx + (this.color * 32);
			if(this.board.isEmpty(square)) {
				this.moves.push(square);
			}
		}
	}
};

Pawn.prototype._addCaptureMoves = function() {
	__.each(this._CAPTURE_DIRECTIONS, function(direction) {
		var target = this.idx + (this.color * 16) + direction;
		if (this.canCapture(target) || this.canCaptureEnPassant(target)) {
			this.moves.push(target);
		}
		if (this.board.isOnBoard(target)) {
			this.attacks.push(target);
		}

	}, this);
};

Pawn.prototype._CAPTURE_DIRECTIONS = [1, -1];

exports.Pawn = Pawn;
