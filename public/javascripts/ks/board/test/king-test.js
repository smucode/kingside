var vows = require('vows');
var assert = require('assert');

var King = require('../King').King;
var Board = require('../Board').Board;

vows.describe('King').addBatch({
	'when creating a board with two kings' : {
		topic : new Board('k7/8/8/4k3/8/8/8/8 w KQkq - 0 1'),

		'they should be kings' : function(topic) {
			var king = topic._getPiece('a8');
			assert.instanceOf(king, King);
			
			king = topic._getPiece('e5');
			assert.instanceOf(king, King);
		},
		
		'the king in the center should have eight moves': function(topic) {
			var king = topic._getPiece('e5');
			king.calculate();
			assert.equal(king.moves.length, 8);
		},
		
		'the king in the corner should have three moves': function(topic) {
			var king = topic._getPiece('a8');
			king.calculate();
			assert.equal(king.moves.length, 3);
		}
		
	},
	'given a board' : {
		topic : new Board('kp6/P7/8/8/8/8/8/8 w KQkq - 0 1'),

		'the king should have two moves' : function(topic) {
			var king = topic._getPiece('a8');
			king.calculate();
			assert.equal(king.moves.length, 2);
		}
	},
	'kings with free path to the rooks and full castling rights' : {
		topic : new Board('r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1'),

		'white king should have 4 moves' : function(topic) {
			var piece = topic._getPiece('e1').calculate();
			assert.equal(piece.moves.length, 4);
		},
		
		'black king should have 4 moves' : function(topic) {
			var piece = topic._getPiece('e8').calculate();
			assert.equal(piece.moves.length, 4);
		}
	},
	'kings with free path to the rooks and no castling rights' : {
		topic : new Board('r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w - - 0 1'),

		'white king should have 2 moves' : function(topic) {
			var piece = topic._getPiece('e1').calculate();
			assert.equal(piece.moves.length, 2);
		},
		
		'black king should have 2 moves' : function(topic) {
			var piece = topic._getPiece('e8').calculate();
			assert.equal(piece.moves.length, 2);
		}
	}
}).export(module);
