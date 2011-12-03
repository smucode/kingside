var __ = require('underscore');
var Piece = require('./Piece').Piece;

var King = function(idx, color, board) {
	this.idx = idx;
	this.color = color;
	this.board = board;
	this.moves = [];
	
	this._castling = (this.color == 1) ? {Q: -1, K: 1} : {q: -1, k: 1};
	this._castlingIdx = (this.color == 1) ? 4 : (4 + (16 * 7));
};

King.prototype = new Piece();

King.prototype.calculate = function() {
	this._addRegularMoves();
	this._addCastlingMoves();
	return this;
};

King.prototype.canCastle = function(code) {
	return this.idx == this._castlingIdx && this.board.canCastle(code);
};

King.prototype.isAttacked = function(idx) {
	return this.board.isAttacked(idx);
};

King.prototype._addRegularMoves = function() {
	__.each(this.DIRECTIONS, function(direction) {
		var target = this.idx + direction;
		if ((this.canMoveTo(target) && !this.isAttacked(target)) || this.canCapture(target)) {
			this.moves.push(target);
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

// King.prototype.CASTLING = { 3: 'Q', 5: 'K', 115: 'q', 117: 'k' };
King.prototype.DIRECTIONS = [-1, 1, 16 - 1, 16, 16 + 1, -16 - 1, -16, -16 + 1];

exports.King = King;
