var vows = require('vows');
var assert = require('assert');

var Factory = require('../PieceFactory').PieceFactory;
var Pawn = require('../Pawn').Pawn;

vows.describe('PieceFactory').addBatch({
	'given a factory' : {
		topic : Factory,

		'it should be able to create white pawns' : function(topic) {
			var pawn = topic.create('p');
			assert.instanceOf(pawn, Pawn);
		},
		'it should be able to create black pawns' : function(topic) {
			var pawn = topic.create('P');
			assert.instanceOf(pawn, Pawn);
		}
	}
}).export(module);
