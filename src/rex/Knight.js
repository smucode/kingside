if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

define(["require", "underscore","./Piece"], function(require, __, Piece) {

    var Knight = function(idx, color, board) {
        this.idx = idx;
        this.color = color;
        this.board = board;
        this.moves = [];
    };

    Knight.prototype = new Piece();

    Knight.prototype.calculate = function() {
        this.moves = [];
        this.checks = [];
        this.attacks = [];
        this.pinning = {};
        this.behindKing = null;

        this._addRegularMoves();
        this._removePinnedMoves();
        this._removeMovesNotHelpingCheckedKing();
    };

    Knight.prototype._addRegularMoves = function() {
        __.each(this.DIRECTIONS, function(direction) {
            var target = this.idx + direction;
            if (this.canMoveTo(target) || this.canCapture(target)) {
                this.moves.push(target);
            }
            if (this.canCapture(target)) {
                var p = this.board._getPieceAt(target);
                if (p.color != this.color && p.type == 3) {
                    this.checks = [this.idx];
                }
            }
            if (this.board.isOnBoard(target)) {
                this.attacks.push(target);
            }
        }, this);
    };

    Knight.prototype.DIRECTIONS = [16 - 2, 16 + 2, 32 - 1, 32 + 1, -16 - 2, -16 + 2, -32 - 1, -32 + 1];

    return Knight;

});
