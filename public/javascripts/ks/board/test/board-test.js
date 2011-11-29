var vows = require('vows'),
    assert = require('assert');

var board = require('../Board');

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
