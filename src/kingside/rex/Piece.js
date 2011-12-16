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
	this.moves = [];
	this.checks = [];
	this.attacks = [];
	this.pinning = {};
	this.behindKing = null;
	
	__.each(directions, function(direction) {
		this._addNextDirectionalMove(direction);
	}, this);
	
	this._removePinnedMoves();
	this._removeMovesNotHelpingCheckedKing();
};

Piece.prototype._removePinnedMoves = function() {
	if (this.color == this.board._getCurrentColor()) {
		var pinned = this.board.isPinned(this.idx);
		if (pinned) {
			this.moves = __.intersect(this.moves, pinned);
		}
	}
};

Piece.prototype._addNextDirectionalMove = function(direction, offset) {
	offset = offset || 1;
	var target = this.idx + (offset * direction);
	if (this.canMoveTo(target)) {
		this.moves.push(target);
		this.attacks.push(target);
		this._addNextDirectionalMove(direction, ++offset);
	} else {
		if (this.canCapture(target)) {
			this.moves.push(target);
			this._checkPinning(target, direction, offset);
			this._checkKingAttacks(target, direction, offset);
		}
		if (this.board.isOnBoard(target)) {
			this.attacks.push(target);
		}
	}
};

Piece.prototype._removeMovesNotHelpingCheckedKing = function() {
	if (this.color == this.board._getCurrentColor()) {
		var checkingPieces = this.board.getCheckingPieces();
		if (checkingPieces.length == 1) {
			this.moves = __.intersect(this.moves, checkingPieces[0].checks);
		} else if (checkingPieces.length > 1) {
			this.moves = [];
		}
	}
};

Piece.prototype._checkKingAttacks = function(square, direction, offset) {
	var piece = this.board._getPieceAt(square);
	if (piece.type == 3) {
		this.checks = [];
		
		this._setMoveBehindKing(direction, offset);
		this._backtrackPinnedMoves(direction, --offset, this.checks);
	}
};

Piece.prototype._checkPinning = function(pinned, direction, offset) {
	var target = this.idx + ((offset + 1) * direction);
	if (this.canMoveTo(target)) {
		this._checkPinning(pinned, direction, ++offset);
	} else if (this.canCapture(target)) {
		var piece = this.board._getPieceAt(target);
		if (piece.type == 3 && piece.color != this.color) {
			this.pinning[pinned] = [];
			this._backtrackPinnedMoves(direction, offset, this.pinning[pinned]);
		}
	}
};

Piece.prototype._setMoveBehindKing = function(direction, offset) {
	var behind = this.idx + ((offset + 1) * direction);
	if (this.canMoveTo(behind)) {
		this.behindKing = behind;
	}
};

Piece.prototype._backtrackPinnedMoves = function(direction, offset, arr) {
	var target = this.idx + (offset * direction);
	arr.push(target);
	if (target != this.idx) {
		this._backtrackPinnedMoves(direction, --offset, arr);
	}
};

exports.Piece = Piece;