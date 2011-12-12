var __ = require('underscore');

var vows = require('vows'), assert = require('assert');

var board = require('../Board');
var King = require('../King').King;
var Pawn = require('../Pawn').Pawn;
var Rook = require('../Rook').Rook;
var Queen = require('../Queen').Queen;

vows.describe('Board').addBatch({
	'when creating a board with empty ctor' : {
		topic : new board.Board(),

		'it should not be null' : function(topic) {
			assert.notEqual(null, topic);
		},
		'number of pieces should be 32' : function(topic) {
			assert.equal(topic._getPieces().length, 32);
		},
		'the piece at a2 should have some moves' : function(topic) {
			var moves = topic.getMoves('a2');
			assert.equal(moves.length, 2);
		},
		'only the active color should have moves' : function(topic) {
			var moves = topic.getMoves('a2');
			assert.equal(moves.length, 2);

			moves = topic.getMoves('a7');
			assert.equal(moves.length, 0);
		},
		'erroneous move should throw' : function(topic) {
			assert.throws(function() {
				topic.move('a1', 'b8');
			});
		}
	},
	'creating a board with the initial configuration' : {
		topic : new board.Board(),

		'white should be able to move d2 -> d4' : function(topic) {
			topic.move('d2', 'd4');
		},
		'white should not be able to move e2 -> e4' : function(topic) {
			assert.throws(function() {
				topic.move('e2', 'e4');
			});
		},
		'black should be able to move e7 -> e5' : function(topic) {
			topic.move('e7', 'e5');
		},
		'white should be able to capture pawn at e5' : function(topic) {
			topic.move('d4', 'e5');
		},
		'black should not able to move pawn at e5' : function(topic) {
			assert.throws(function() {
				topic.move('e5', 'e4');
			});
		}
	},
	'testing scolars mate' : {
		topic : new board.Board(),

		'scholars mate should cause mate' : function(topic) {
			topic.move('e2', 'e4');
			topic.move('e7', 'e5');
			topic.move('d1', 'h5');
			topic.move('b8', 'c6');
			topic.move('f1', 'c4');
			topic.move('g8', 'f6');
			var move = topic.move('h5', 'f7');

			var allMoves = __(topic._getPieces(-1)).chain().map(function(p) {
				return p.moves;
			}).flatten().value().length;

			assert.equal(allMoves, 0);
			assert.equal(move.finished, 'checkmate');
		}
	},
	'a board where pawn can promote' : {
		topic : new board.Board('8/P7/8/8/8/8/8/8 w KQkq - 0 1'),

		'should be promoted to queen' : function(topic) {
			var move = topic.move('a7', 'a8');
			var p = topic._getPiece('a8');
			assert.equal(p.moves.length, 21);
			assert.equal(move.promotion, 'Q');
		}
	},
	'a board where no piece can move' : {
		topic : new board.Board('k7/2Q5/8/8/8/8/8/8 b KQkq - 0 1'),

		'is stalemate' : function(topic) {
			var p = topic._getPiece('a8');
			assert.equal(p.moves.length, 0);
			assert.equal(topic.getState().finished, 'stalemate');
		}
	},
	'a board where king is attacked' : {
		topic : new board.Board('k7/Q7/8/8/8/8/8/8 b KQkq - 0 1'),

		'is in check' : function(topic) {
			var p = topic._getPiece('a8');
			assert.equal(p.moves.length, 1);
			assert.isTrue(topic.getState().check);
		}
	},
	'a board with no real move in 49 moves' : {
		topic : new board.Board('k7/8/8/8/8/8/8/P7 b - - 49 1'),

		'should be finished due to halfmoves' : function(topic) {
			topic.move('a8', 'b8');
			assert.equal(topic.getState().finished, 'halfmoves');
		}
	},
	'creating a board' : {
		topic : new board.Board('p6R/p7/p2p5/p7/8/8/8/k6Q w KQkq - 0 1'),

		'it should contain 8 pieces' : function(topic) {
			assert.equal(topic._getPieces().length, 8);
		},
		'a1 should contain a king' : function(topic) {
			assert.instanceOf(topic._getPiece('a1'), King);
		},
		'a8 should contain a pawn' : function(topic) {
			assert.instanceOf(topic._getPiece('a8'), Pawn);
		},
		'h1 should contain a queen' : function(topic) {
			assert.instanceOf(topic._getPiece('h1'), Queen);
		},
		'h8 should contain a rook' : function(topic) {
			assert.instanceOf(topic._getPiece('h8'), Rook);
		},
		'd6 should contain a piece' : function(topic) {
			assert.instanceOf(topic._getPiece('d6'), Pawn);
		},
		'a7 should contain a piece' : function(topic) {
			assert.instanceOf(topic._getPiece('a7'), Pawn);
		},
		'a6 should contain a piece' : function(topic) {
			assert.instanceOf(topic._getPiece('a6'), Pawn);
		},
		'a5 should contain a piece' : function(topic) {
			assert.instanceOf(topic._getPiece('a5'), Pawn);
		}
	},
	'when resolving pos to idx' : {
		topic : new board.Board(),

		'a1 should resolve to 0' : function(topic) {
			assert.equal(topic._posToIdx('a1'), 0);
		},
		'a2 should resolve to 16' : function(topic) {
			assert.equal(topic._posToIdx('a2'), 16);
		},
		'b1 should resolve to 1' : function(topic) {
			assert.equal(topic._posToIdx('b1'), 1);
		},
		'b2 should resolve to 17' : function(topic) {
			assert.equal(topic._posToIdx('b2'), 17);
		},
		'a9 should throw' : function(topic) {
			assert.throws(function() {
				topic._posToIdx('a9');
			});
		},
		'x6 should throw' : function(topic) {
			assert.throws(function() {
				topic._posToIdx('x6');
			});
		}
	},
	'testing move' : {
		topic : new board.Board(),

		'a3a4 should throw' : function(topic) {
			assert.throws(function() {
				topic.move('a3', 'a4');
			});
		},
		'a2a3 should work' : function(topic) {
			var move = topic.move('a2', 'a3');
			assert.ok(move);
		}
	},
	'when resolving idx to pos' : {
		topic : new board.Board(),

		'0 should resolve to a1' : function(topic) {
			assert.equal(topic._idxToPos(0), 'a1');
		},
		'16 should resolve to a2' : function(topic) {
			assert.equal(topic._idxToPos(16), 'a2');
		},
		'b1 should resolve to 1' : function(topic) {
			assert.equal(topic._idxToPos(1), 'b1');
		},
		'b2 should resolve to 17' : function(topic) {
			assert.equal(topic._idxToPos(17), 'b2');
		},
		'15 should throw' : function(topic) {
			assert.throws(function() {
				topic._idxToPos('15');
			});
		}
	}
})["export"](module);
