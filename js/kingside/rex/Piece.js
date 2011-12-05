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
	this.pin = null;
	if (this.board.isPinned(this.idx)) {
		return;
	}
	__.each(directions, function(direction) {
		this._addNextDirectionalMove(direction);
	}, this);
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
	if (this.board.isOnBoard(target)) {
		var piece = this.board._getPieceAt(target);
		if (piece && piece.type == 3 && piece.color != this.color) {
			this.pin = pinned;
		}
	}
};

exports.Piece = Piece;