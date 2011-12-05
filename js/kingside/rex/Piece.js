var __ = require('underscore');

var Piece = function() {
	this.attacks = [];
};

Piece.prototype.canCapture = function(idx) {
	var piece = this.board._getPieceAt(idx);
	return piece && piece.color != this.color;
};

Piece.prototype.canMoveTo = function(idx) {
	var piece = this.board._getPieceAt(idx);
	return !piece && this.board.isOnBoard(idx);
};

Piece.prototype.addDirectionalMoves = function(directions) {
	this.pinning = {};
	
	__.each(directions, function(direction) {
		this._addNextDirectionalMove(direction);
	}, this);
	
	var pinned = this.board.isPinned(this.idx);
	if (pinned) {
		this.moves = __.intersect(this.moves, pinned);
	}
};

Piece.prototype._addNextDirectionalMove = function(direction, offset) {
	offset = offset || 1;
	var target = this.idx + (offset * direction);
	if (this.canMoveTo(target)) {
		this.moves.push(target);
		this._addNextDirectionalMove(direction, ++offset);
	} else {
		if (this.canCapture(target)) {
			this.moves.push(target);
			this._checkPinning(target, direction, ++offset);
		}
		if (this.board.isOnBoard(target)) {
			this.attacks.push(target);
		}
	}
};

Piece.prototype._checkPinning = function(pinned, direction, offset) {
	var target = this.idx + (offset * direction);
	if (this.canMoveTo(target)) {
		this._checkPinning(pinned, direction, ++offset);
	} else if (this.canCapture(target)) {
		var piece = this.board._getPieceAt(target);
		if (piece.type == 3 && piece.color != this.color) {
			this.pinning[pinned] = [];
			this._backtrackPinnedMoves(direction, --offset, this.pinning[pinned]);
		}
		
	}
};

Piece.prototype._backtrackPinnedMoves = function(direction, offset, arr) {
	var target = this.idx + (offset * direction);
	arr.push(target);
	if (target != this.idx) {
		this._backtrackPinnedMoves(direction, --offset, arr);
	}
}

exports.Piece = Piece;