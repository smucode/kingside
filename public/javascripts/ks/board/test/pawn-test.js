var vows = require('vows'), assert = require('assert');

var Pawn = require('../Pawn').Pawn;
var Board = require('../Board').Board;

var emptyBoard = {
	isEmpty : function() {
		return true;
	}
}

var fullBoard = {
	isEmpty : function() {
		return false;
	}
}

vows.describe('Pawn').addBatch({
	'when creating a board with a single pawn' : {
		topic : new Board('8/p7/8/8/8/8/8/8 w KQkq - 0 1'),

		'it should be a pawn' : function(topic) {
			var pawn = topic._getPiece('a2');
			assert.instanceOf(pawn, Pawn);
		},
		'it should have two valid moves' : function(topic) {
			var pawn = topic._getPiece('a2');
			pawn.calculate();
			assert.equal(pawn.moves.length, 2);
		}
	}
}).export(module);
