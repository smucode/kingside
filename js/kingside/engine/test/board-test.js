var vows = require('vows'),
    assert = require('assert');

var board = require('../Board');
var King = require('../King').King;
var Pawn = require('../Pawn').Pawn;
var Rook = require('../Rook').Rook;
var Queen = require('../Queen').Queen;


var suite = vows.describe('Board');

suite.addBatch({
	'when creating a board with empty ctor': {
        topic: new board.Board(),

        'it should not be null': function (topic) {
            assert.notEqual(null, topic);
        },
        
        'number of pieces should be 32': function (topic) {
            assert.equal(topic._getPieces().length, 32);
        }
    }
});

suite.addBatch({
	'creating a board': {
		topic: new board.Board('p6R/p7/p2p5/p7/8/8/8/k6Q w KQkq - 0 1'),
		
		'it should contain 8 pieces': function(topic) {
			assert.equal(topic._getPieces().length, 8);
		},
		'a1 should contain a king': function(topic) {
			assert.instanceOf(topic._getPiece('a1'), King);
		},
		'a8 should contain a pawn': function(topic) {
			assert.instanceOf(topic._getPiece('a8'), Pawn);
		},
		'h1 should contain a queen': function(topic) {
			assert.instanceOf(topic._getPiece('h1'), Queen);
		},
		'h8 should contain a rook': function(topic) {
			assert.instanceOf(topic._getPiece('h8'), Rook);
		},
		'd6 should contain a piece': function(topic) {
			assert.instanceOf(topic._getPiece('d6'), Pawn);
		},
		'a7 should contain a piece': function(topic) {
			assert.instanceOf(topic._getPiece('a7'), Pawn);
		},
		'a6 should contain a piece': function(topic) {
			assert.instanceOf(topic._getPiece('a6'), Pawn);
		},
		'a5 should contain a piece': function(topic) {
			assert.instanceOf(topic._getPiece('a5'), Pawn);
		}
	}
});

suite.addBatch({
	'when resolving pos to idx': {
        topic: new board.Board(),

        'a1 should resolve to 0': function (topic) {
            assert.equal(topic._posToIdx('a1'), 0);
        },
        
        'a2 should resolve to 16': function (topic) {
            assert.equal(topic._posToIdx('a2'), 16);
        },
        
        'b1 should resolve to 1': function (topic) {
            assert.equal(topic._posToIdx('b1'), 1);
        },
        
        'b2 should resolve to 17': function (topic) {
            assert.equal(topic._posToIdx('b2'), 17);
        },
        
        'a9 should throw': function(topic) {
			assert.throws(function() { topic._posToIdx('a9'); });
        },
        
        'x6 should throw': function(topic) {
			assert.throws(function() { topic._posToIdx('x6'); });
        }
    }
});


suite.export(module);
