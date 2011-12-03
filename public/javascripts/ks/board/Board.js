var __ = require('underscore');
var Fen = require('./Fen').Fen;
var Factory = require('./PieceFactory').PieceFactory;

var Board = function(fen) {
	
	this._fen = new Fen(fen);
	this._board = new Array(128);
	
	__.each(this._fen.pieces, function(piece, pos) {
		var idx = this._posToIdx(pos);
		this._board[idx] = Factory.create(piece, idx, this);
	}, this);
	
	// todo: calculate moves in ctor?
};

Board.prototype = {
	
	WHITE: 1,
	BLACK: -1,
	
	_files: 'abcdefgh',
	
	_posToIdx: function(pos) {
		if (!pos || !pos.match(/[a-h]{1}[0-8]{1}/)) {
			throw 'illegal pos ' + pos;
		}
		var c = this._files.indexOf(pos[0]);
		return c + ((pos[1] - 1) * 16);
	},
	
	_getPieceAt: function(idx) {
		return this._board[idx];
	},
	
	_getPieces: function(color) {
		return __.filter(this._board, function(p) {
			if (!color) {
				return p;
			} else {
				return p && p.color == color;
			}
		});
	},
	
	_getPiece: function(pos) {
		var idx = this._posToIdx(pos);
		return this._getPieceAt(idx);
	},
	
	_getCurrentColor: function() {
		return (this._fen.activeColor == 'w') ? this.WHITE : this.BLACK;
	},
	
	_calculate: function() {
		var currentColor = this._getCurrentColor();
		__.each(this._getPieces(currentColor * -1), function(p) {
			p.calculate();
		});
		__.each(this._getPieces(currentColor), function(p) {
			p.calculate();
		});
	},
	
	isAttacked: function(idx) {
		var currentColor = this._getCurrentColor();
		return __.detect(this._getPieces(currentColor * -1), function(p) {
			return p.moves.indexOf(idx) != -1;
		});
	},
	
	isProtected: function(idx) {
		var currentColor = this._getCurrentColor();
		return __.detect(this._getPieces(currentColor * -1), function(p) {
			return p.moves.indexOf(idx) != -1 || p.attacks.indexOf(idx) != -1;
		});
	},
	
	isEmpty: function(idx) {
		return !this._getPieceAt(idx);
	},
	
	isOnBoard: function(idx) {
		return idx >= 0 && idx < 127 && (idx & 0x88) === 0;
	},
	
	canCastle: function(code) {
		return this._fen.canCastle(code);
	},
	
	isEnPassant: function(idx) {
		var ep = this._fen.enPassant;
		if (ep && ep != '-') {
			var epIdx = this._posToIdx(ep);
			return idx == epIdx;
		}
		return false;
	},
	
	getMoves: function(pos) {
		var idx = this._posToIdx(pos);
		var piece = this._getPieceAt(idx);
		if (piece) {
			return piece.getMoves();
		}
		return [];
	}
};

exports.Board = Board;