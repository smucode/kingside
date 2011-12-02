var vows = require('vows'), assert = require('assert');

var Pawn = require('../Pawn').Pawn;
var Board = require('../Board').Board;

vows.describe('Pawn').addBatch({
	'given a board with a pawn' : {
		topic : new Board('8/p7/8/8/8/8/p1p5/1P6 w KQkq - 0 1'),

		'it should have two valid moves' : function(topic) {
			var pawn = topic._getPiece('a7');
			pawn.calculate();
			assert.equal(pawn.moves.length, 2);
		}
	},
	'given a board with a pawn who can capture' : {
		topic : new Board('8/1p6/P1P5/8/8/8/8/8 w KQkq - 0 1'),

		'it should have four valid moves' : function(topic) {
			var pawn = topic._getPiece('b7');
			pawn.calculate();
			assert.equal(pawn.moves.length, 4);
		}
	},
	'given a board with a pawn who can capture en passant' : {
		topic : new Board('8/8/8/Pp6/8/8/8/8 w KQkq b6 0 1'),

		'it should have two valid moves' : function(topic) {
			var pawn = topic._getPiece('a5');
			pawn.calculate();
			assert.equal(pawn.moves.length, 2);
		}
	}
}).export(module);
