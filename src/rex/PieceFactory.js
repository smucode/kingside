if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

define(["require", "./Pawn","./King","./Rook","./Knight","./Bishop","./Queen"], function(require, Pawn, King,
            Rook, Knight, Bishop, Queen) {

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
            King,
            null,
            Bishop,
            Rook,
            Queen
        ];
        
        var _pieceMap = {
            r: Const.BLACK * Const.ROOK, 
            n: Const.BLACK * Const.KNIGHT,
            b: Const.BLACK * Const.BISHOP,
            q: Const.BLACK * Const.QUEEN,
            k: Const.BLACK * Const.KING,
            p: Const.BLACK * Const.PAWN,
            R: Const.WHITE * Const.ROOK, 
            N: Const.WHITE * Const.KNIGHT,
            B: Const.WHITE * Const.BISHOP,
            Q: Const.WHITE * Const.QUEEN,
            K: Const.WHITE * Const.KING,
            P: Const.WHITE * Const.PAWN
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

    return PieceFactory;
});
