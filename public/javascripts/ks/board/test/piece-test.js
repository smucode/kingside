var vows = require('vows');
var assert = require('assert');

var Piece = require('../Piece').Piece;
var Board = require('../Board').Board;

vows.describe('Piece').addBatch({
	'a mocked board' : {
		topic : new Board(),

		'with a piece' : {
			topic: function(board) {
				var piece = new Piece();
				piece.board = board;
				return piece;
			},
			
			'it should be able to move within the board': function(piece) {
				assert.isTrue(piece.canMoveTo(2));
			},
			
			'is should not be able to move outside the board': function(piece) {
				assert.isFalse(piece.canMoveTo(10));
				assert.isFalse(piece.canMoveTo(-1));
				assert.isFalse(piece.canMoveTo(127));
				assert.isFalse(piece.canMoveTo(256));
			}
		}
	}
}).export(module);
