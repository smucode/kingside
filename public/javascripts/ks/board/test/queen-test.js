var vows = require('vows');
var assert = require('assert');

var Board = require('../Board').Board;
var Queen = require('../Queen').Queen;

vows.describe('Queen').addBatch({
	'when creating a board with two queens' : {
		topic : new Board('q7/8/8/4q3/8/8/8/8 w KQkq - 0 1'),

		'they should be queens' : function(topic) {
			var piece = topic._getPiece('a8');
			assert.instanceOf(piece, Queen);
			
			piece = topic._getPiece('e5');
			assert.instanceOf(piece, Queen);
		},
		
		'the queen in the center should have 27 moves': function(topic) {
			var piece = topic._getPiece('e5');
			piece.calculate();
			assert.equal(piece.moves.length, 27);
		},
		
		'the queen in the corner should have 21 moves': function(topic) {
			var piece = topic._getPiece('a8');
			piece.calculate();
			assert.equal(piece.moves.length, 21);
		}
		
	}
}).export(module);
