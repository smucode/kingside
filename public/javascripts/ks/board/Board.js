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
	
};

Board.prototype = {
	
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
	
	_getPieces: function() {
		return __.filter(this._board, function(p) {
			return p;
		});
	},
	
	_getPiece: function(pos) {
		var idx = this._posToIdx(pos);
		return this._getPieceAt(idx);
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