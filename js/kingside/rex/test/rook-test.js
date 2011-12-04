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
		}
		
	},
	'given a board where rook can only capture' : {
		topic : new Board('rp6/P7/8/8/8/8/8/8 b KQkq - 0 1'),

		'it should have one move': function(topic) {
			var rook = topic._getPiece('a8');
			assert.equal(rook.moves.length, 1);
		}
		
	}
}).export(module);
