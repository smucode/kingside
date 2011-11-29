var vows = require('vows'), 
	assert = require('assert');

var Pawn = require('../Pawn').Pawn;

var mock = {
	isEmpty: function() {
		return true;
	}
}

vows.describe('Pawn').addBatch({
	'when creating a pawn' : {
		topic : new Pawn(16, 0, mock),

		'it should be a pawn' : function(topic) {
			assert.instanceOf(topic, Pawn);
		},
		'it should have some valid moves' : function(topic) {
			topic.calculate();
			assert.equal(topic.moves.length, 2);
		}
	}
}).export(module);