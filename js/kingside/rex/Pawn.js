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
	this.moves = [];
	this.checks = [];
	this.attacks = [];
	this.pinning = {};
	this.behindKing = null;
	
	this._addRegularMoves();
	this._addCaptureMoves();
	this._removePinnedMoves();
	this._removeMovesNotHelpingCheckedKing();
};

Pawn.prototype.canCaptureEnPassant = function(idx) {
	return this.board.isEnPassant(idx); 
};

Pawn.prototype._addRegularMoves = function() {
	var square = this.idx + (this.color * 16);
	if(this.board.isOnBoard(square) && this.board.isEmpty(square)) {
		this.moves.push(square);
		if((this.color == 1 && this.idx >= 16 && this.idx < 16 + 8) || (this.color == -1 && this.idx >= 96 && this.idx < 96 + 8)) {
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
		if (this.canCapture(target)) {
			var p = this.board._getPieceAt(target);
			if (p.color != this.color && p.type == 3) {
				this.checks = [this.idx];
			}
		}
		if (this.board.isOnBoard(target)) {
			this.attacks.push(target);
		}
	}, this);
};

Pawn.prototype._CAPTURE_DIRECTIONS = [1, -1];

exports.Pawn = Pawn;
