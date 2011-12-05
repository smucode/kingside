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
	
	this._calculate();
};

Board.prototype = {
	
	WHITE: 1,
	BLACK: -1,
	
	_files: 'abcdefgh',
	
	_posToIdx: function(pos) {
		if (!pos || typeof pos != 'string' || !pos.match(/[a-h]{1}[0-8]{1}/)) {
			throw 'illegal pos ' + pos;
		}
		var c = this._files.indexOf(pos[0]);
		return c + ((pos[1] - 1) * 16);
	},
	
	_idxToPos: function(idx) {
		var file = idx % 16;
		var rank = Math.floor(idx / 16);
		var pos = this._files[file] + (rank + 1);
		if (typeof pos != 'string') {
			throw 'illegal idx ' + idx;
		}
		return pos;
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
	
	isPinned: function(idx) {
		var currentColor = this._getCurrentColor();
		var pieces = this._getPieces(currentColor * -1);
		
		var pinningPiece = __.detect(pieces, function(p) {
			return p.pinning && p.pinning[idx];
		});
		
		if (pinningPiece) {
			return __(pinningPiece.pinning[idx]).chain().clone().without(idx).union(pinningPiece.idx).value();
		}
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
		if (piece && piece.color == this._getCurrentColor()) {
			return __.map(piece.moves, function(idx) {
				return this._idxToPos(idx);
			}, this);
		}
		return [];
	}
};

exports.Board = Board;
