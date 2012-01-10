if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

define(["require", "underscore","./Piece"], function(require, __, Piece) {
    
    var Rook = function(idx, color, board) {
        this.idx = idx;
        this.color = color;
        this.board = board;
        this.moves = [];
    };

    Rook.prototype = new Piece();

    Rook.prototype.calculate = function() {
        this.addDirectionalMoves(this.DIRECTIONS);
    };

    Rook.prototype.DIRECTIONS = [1, -1, 16, -16];

    return Rook;

});
