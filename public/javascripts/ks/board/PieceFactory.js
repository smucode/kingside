var Pawn = require('./Pawn').Pawn;
var King = require('./King').King;
var Knight = require('./Knight').Knight;

var Const = {
	PAWN: 1,
	KNIGHT: 2,
	KING: 3,
	BISHOP: 5,
	ROOK: 6,
	QUEEN: 7,
	WHITE: 1,
	BLACK: -1
};

var PieceFactory = (function (){
	var _instanceArr = [
		null,
		Pawn,
		Knight,
		King
	];
	
	var _pieceMap = {
		r: Const.WHITE * Const.ROOK, 
		n: Const.WHITE * Const.KNIGHT,
		b: Const.WHITE * Const.BISHOP,
		q: Const.WHITE * Const.QUEEN,
		k: Const.WHITE * Const.KING,
		p: Const.WHITE * Const.PAWN,
		R: Const.BLACK * Const.ROOK, 
		N: Const.BLACK * Const.KNIGHT,
		B: Const.BLACK * Const.BISHOP,
		Q: Const.BLACK * Const.QUEEN,
		K: Const.BLACK * Const.KING,
		P: Const.BLACK * Const.PAWN
	};
	
	return {
		create: function(charCode, pos, board) {
			var numCode = _pieceMap[charCode];
			var color = numCode > 0 ? Const.WHITE : Const.BLACK;
			var inst = _instanceArr[Math.abs(numCode)];
			if (inst) {
				return new inst(pos, color, board);
			} else {
				// remove when implemented all pieces
				return {};
			}
		}
	};
}());

exports.PieceFactory = PieceFactory;