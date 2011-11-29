var __ = require('underscore');
var Factory = require('./PieceFactory').PieceFactory;

var Board = function(fen) {
	fen = fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
	
	var _board = new Array(128);
	
	// todo: move to some sort of fen util..
	__.each(fen.split(' ')[0].split('/'), function(file, rank) {
		__.each(file.split(''), function(p, i) {
			if (!p.match(/[0-8]/)) {
				var pos = (rank * 16) + i;
				_board[pos] = Factory.create(p, pos);
			}
		});
	});
	
	this._board = _board;
};

Board.prototype = {
	
	_posIdxMap: {a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7},
	
	_posToIdx: function(pos) {
		var c = pos[0];
		var n = pos[1];
		if (isNaN(n) || n > 8 || n < 0 || 'abcdefgh'.indexOf(c) == -1) {
			throw 'illegal pos ' + pos;
		}
		return this._posIdxMap[c] + ((n - 1) * 16);
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