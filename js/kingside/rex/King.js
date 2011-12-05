var __ = require('underscore');
var Piece = require('./Piece').Piece;

var King = function(idx, color, board) {
	this.idx = idx;
	this.color = color;
	this.board = board;
	this.moves = [];
	this.type = 3;
	
	this._castlingIdx = (this.color == 1) ? 4 : (4 + (16 * 7));
	this._castling = (this.color == 1) ? {Q: -1, K: 1} : {q: -1, k: 1};
};

King.prototype = new Piece();

King.prototype.calculate = function() {
	this._addRegularMoves();
	this._addCastlingMoves();
	return this;
};

King.prototype.canCastle = function(code, direction) {
	var hasCastlingRights = this.idx == this._castlingIdx && this.board.canCastle(code);
	if (!hasCastlingRights) {
		return false;
	}
	return !this._pathToRookIsBlocked(code);
};

King.prototype._pathToRookIsBlocked = function(code) {
	return __.find(this.CASTLE_SQUARES[code.toLowerCase()], function(offset) {
		var target = this.idx + offset;
		return !this.canMoveTo(target) || this.isAttacked(target);
	}, this);
};

King.prototype.isAttacked = function(idx) {
	return this.board.isAttacked(idx);
};

King.prototype.isProtected = function(idx) {
	return this.board.isProtected(idx);
};

King.prototype._addRegularMoves = function() {
	__.each(this.DIRECTIONS, function(direction) {
		var target = this.idx + direction;
		if ((this.canMoveTo(target) && !this.isAttacked(target)) || (this.canCapture(target) && !this.isProtected(target))) {
			this.moves.push(target);
		}
		if (this.board.isOnBoard(target)) {
			this.attacks.push(target);
		}
	}, this);
};

King.prototype._addCastlingMoves = function() {
	__.each(this._castling, function(direction, code) {
		if (this.canCastle(code)) {
			this.moves.push(this.idx + (direction * 2));
		}
	}, this);
};

King.prototype.CASTLE_SQUARES = { q: [-1, -2, -3], k: [1, 2] };
King.prototype.DIRECTIONS = [-1, 1, 16 - 1, 16, 16 + 1, -16 - 1, -16, -16 + 1];

exports.King = King;
