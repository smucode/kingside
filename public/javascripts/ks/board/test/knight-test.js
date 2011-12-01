var vows = require('vows');
var assert = require('assert');

var Knight = require('../Knight').Knight;
var Board = require('../Board').Board;

vows.describe('Pawn').addBatch({
	'when creating a board with two knights' : {
		topic : new Board('n7/8/8/4n3/8/8/8/8 w KQkq - 0 1'),

		'they should be knights' : function(topic) {
			var knight = topic._getPiece('a8');
			assert.instanceOf(knight, Knight);
			
			knight = topic._getPiece('e5');
			assert.instanceOf(knight, Knight);
		},
		
		'the knight in the center should have eight moves': function(topic) {
			var knight = topic._getPiece('e5');
			knight.calculate();
			assert.equal(knight.moves.length, 8);
		},
		
		'the knight in the corner should have two moves': function(topic) {
			var knight = topic._getPiece('a8');
			knight.calculate();
			assert.equal(knight.moves.length, 2);
		}
		
	}
}).export(module);
