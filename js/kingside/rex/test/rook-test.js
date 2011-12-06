var vows = require('vows');
var assert = require('assert');

var Rook = require('../Rook').Rook;
var Board = require('../Board').Board;

vows.describe('Rook').addBatch({
	'when creating a board with two rooks' : {
		topic : new Board('r7/8/8/4r3/8/8/8/8 w KQkq - 0 1'),

		'they should be rooks' : function(topic) {
			var rook = topic._getPiece('a8');
			assert.instanceOf(rook, Rook);
			
			rook = topic._getPiece('e5');
			assert.instanceOf(rook, Rook);
		},
		
		'the rook in the center should have 14 moves': function(topic) {
			var rook = topic._getPiece('e5');
			assert.equal(rook.moves.length, 14);
		},
		
		'the rook in the corner should have 14 moves': function(topic) {
			var rook = topic._getPiece('a8');
			assert.equal(rook.moves.length, 14);
		},
		
		'recalculating should give the same answer': function(topic) {
			var rook = topic._getPiece('a8');
			rook.calculate();
			assert.equal(rook.moves.length, 14);
		}
		
	},
	'given a board where rook can only capture' : {
		topic : new Board('rp6/P7/8/8/8/8/8/8 b KQkq - 0 1'),

		'it should have one move': function(topic) {
			var rook = topic._getPiece('a8');
			assert.equal(rook.moves.length, 1);
		}
	},
	'given a board with a pinned rook next to the king' : {
		topic : new Board('r7/8/8/8/8/8/R7/K7 w KQkq - 0 1'),

		'it must protect king' : function(topic) {
			var piece = topic._getPiece('a2');
			assert.equal(piece.moves.length, 6);
		}
	},
	'given a board with a pinned rook' : {
		topic : new Board('r7/8/8/8/8/R7/8/K7 w KQkq - 0 1'),

		'it must protect king' : function(topic) {
			var piece = topic._getPiece('a3');
			assert.equal(piece.moves.length, 6);
		}
	}
}).export(module);
