if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

define(["require", "exports", "module", "vows","assert","../Piece","../Board"], function(require, exports, module) {
var vows = require('vows');
var assert = require('assert');

var Piece = require('../Piece').Piece;
var Board = require('../Board').Board;

vows.describe('Piece').addBatch({
	'given a crazy board setup': {
		topic: new Board('rnbqkbnr/pppppppp/8/8/8/8/PPPqPPPP/RNBQKBNR w KQkq - 0 1'),
		'pawns should not be able to move': function(topic) {
			var p = topic._getPiece('a2');
			assert.equal(p.moves.length, 0);
		},
		'king should be able to capture': function(topic) {
			var p = topic._getPiece('e1');
			assert.equal(p.moves.length, 1);
		}
	}
})["export"](module);

});
