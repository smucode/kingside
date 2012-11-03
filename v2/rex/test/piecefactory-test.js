if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

define(["require", "vows","assert","../PieceFactory","../Pawn"], function(require, vows, assert,
            PieceFactory, Pawn) {

vows.describe('PieceFactory').addBatch({
	'given a factory' : {
		topic : PieceFactory,

		'it should be able to create white pawns' : function(topic) {
			var pawn = topic.create('p');
			assert.instanceOf(pawn, Pawn);
		},
		'it should be able to create black pawns' : function(topic) {
			var pawn = topic.create('P');
			assert.instanceOf(pawn, Pawn);
		}
	}
})["export"](module);

});
