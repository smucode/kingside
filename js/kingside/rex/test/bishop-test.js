var vows = require('vows');
var assert = require('assert');

var Board = require('../Board').Board;
var Bishop = require('../Bishop').Bishop;

vows.describe('Bishop').addBatch({
	'when creating a board with two bishops' : {
		topic : new Board('b7/8/8/4b3/8/8/8/8 w KQkq - 0 1'),

		'they should be bishops' : function(topic) {
			var piece = topic._getPiece('a8');
			assert.instanceOf(piece, Bishop);
			piece = topic._getPiece('e5');
			assert.instanceOf(piece, Bishop);
		},
		'the bishop in the center should have 13 moves' : function(topic) {
			var piece = topic._getPiece('e5');
			assert.equal(piece.moves.length, 13);
		},
		'the bishop in the corner should have 7 moves' : function(topic) {
			var piece = topic._getPiece('a8');
			assert.equal(piece.moves.length, 7);
		}
	},
	'given a board' : {
		topic : new Board('b7/1P6/8/4b3/8/8/8/8 w KQkq - 0 1'),

		'the bishop should have one move' : function(topic) {
			var piece = topic._getPiece('a8');
			assert.equal(piece.moves.length, 1);
		}
	},
	'given a board with a pinned bishop' : {
		topic : new Board('r7/8/8/8/8/8/B7/K7 w KQkq - 0 1'),

		'it should not be able to move' : function(topic) {
			var piece = topic._getPiece('a2');
			assert.equal(piece.moves.length, 0);
		}
	}
}).export(module);
