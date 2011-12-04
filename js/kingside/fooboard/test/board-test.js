var vows = require('vows');
var assert = require('assert');

var Board = require('../board').Board;

vows.describe('Board').addBatch({
	'when creating a board': {
		topic: new Board(),
		'it exists': function(topic) {
			assert.ok(topic);
		}
	}
}).export(module);
