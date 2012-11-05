if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

define(["require", "underscore","vows","assert","../Knight","../Board"], function(require, __, vows, assert, Knight,
            Board) {

vows.describe('Pawn').addBatch({
	'when creating a board with two knights' : {
		topic : new Board('n7/8/8/4n3/8/8/8/8 w KQkq - 0 1'),

		'they should be knights' : function(topic) {
			var knight = topic._getPiece('a8');
			assert.instanceOf(knight, Knight);
			
			knight = topic._getPiece('e5');
			assert.instanceOf(knight, Knight);
		},
		
		'the knight in the center should have eight moves': function(topic) {
			var knight = topic._getPiece('e5');
			assert.equal(knight.moves.length, 8);
		},
		
		'the knight in the corner should have two moves': function(topic) {
			var knight = topic._getPiece('a8');
			assert.equal(knight.moves.length, 2);
		},
		
		'recalculating should give the same answer': function(topic) {
			var knight = topic._getPiece('a8');
			knight.calculate();
			assert.equal(knight.moves.length, 2);
		}
		
	},
	'given a board' : {
		topic : new Board('n7/2p5/1P6/4n3/8/8/8/8 w KQkq - 0 1'),
		
		'the knight should have one move': function(topic) {
			var knight = topic._getPiece('a8');
			assert.equal(knight.moves.length, 1);
		}
	},
	'given a board with a pinned knight' : {
		topic : new Board('r7/8/8/1p6/8/N7/8/K7 w KQkq - 0 1'),

		'it should have no moves' : function(topic) {
			var piece = topic._getPiece('a3');
			assert.equal(piece.moves.length, 0);
		}
	},
	'given a board where king is attacked by multipple pieces' : {
		topic : new Board('r6b/8/8/8/8/8/8/KN6 w KQkq - 0 1'),

		'a knight should have no moves' : function(topic) {
			var piece = topic._getPiece('b1');
			assert.equal(piece.moves.length, 0);
		}
	},
	'given a board where king is in check' : {
		topic : new Board('rN6/8/1N6/8/8/8/8/K6N w KQkq - 0 1'),

		'the number number of squares to neutralize the checks is 7' : function(topic) {
			var piece = topic._getPiece('a8');
			assert.equal(piece.checks.length, 7);
			assert.equal(-1, piece.checks.indexOf(0));
		},
		
		'knight that cannot help should have no moves' : function(topic) {
			var piece = topic._getPiece('h1');
			assert.equal(piece.moves.length, 0);
		},
		
		'knight that can block should have 1 move' : function(topic) {
			var piece = topic._getPiece('b8');
			assert.equal(piece.moves.length, 1);
		},
		
		'knight that can block or capture should have 2 moves' : function(topic) {
			var piece = topic._getPiece('b6');
			assert.equal(piece.moves.length, 2);
		}
	},
	'given a board where king is in checked by knight' : {
		topic : new Board('kb6/8/1N6/8/8/8/8/8 b KQkq - 0 1'),

		'only king should be able to move' : function(topic) {
			var bishop = topic._getPiece('b8');
			assert.equal(bishop.moves.length, 0);
		}
	}

})["export"](module);

});
