var vows = require('vows');
var assert = require('assert');

var King = require('../King').King;
var Board = require('../Board').Board;

vows.describe('King').addBatch({
	'when creating a board with two kings' : {
		topic : new Board('k7/8/8/4k3/8/8/8/8 w KQkq - 0 1'),

		'they should be kings' : function(topic) {
			var king = topic._getPiece('a1');
			assert.instanceOf(king, King);
			
			king = topic._getPiece('e4');
			assert.instanceOf(king, King);
		},
		
		'the king in the center should have eight moves': function(topic) {
			var king = topic._getPiece('e4');
			king.calculate();
			assert.equal(king.moves.length, 8);
		},
		
		'the king in the corner should have three moves': function(topic) {
			var king = topic._getPiece('a1');
			king.calculate();
			assert.equal(king.moves.length, 3);
		}
		
	}
}).export(module);
