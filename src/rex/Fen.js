if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

define(["require", "underscore"], function(require, __) {

    var Fen = function(fen) {
        this.pieces = {};
        this.activeColor = null;
        this._parse(fen || Fen.initString);
    };

    // public

    Fen.initString = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    Fen.prototype.move = function(from, to) {
        this._validateMove(from, to);
        this._updateActiveColor();
        this._updateCastling(from, to);
        this._updateEnPassant(from, to);
        this._updateHalfmoveClock(from, to);
        this._updateFullmoveNumber();
        this._updatePiecePlacement(from, to);
    };

    Fen.prototype.canCastle = function(letter) {
        return __.include(this.castling, letter);
    };

    // private

    Fen.prototype._validateMove = function(from, to) {
        var piece = this.pieces[from];
        if (!piece) {
            throw new Error('You must select a valid piece to move: ' + from);
        }
    };

    Fen.prototype._updateFullmoveNumber = function() {
        if (this.activeColor == 'w') {
            this.fullmove++;
        }
    };

    Fen.prototype._updateHalfmoveClock = function(from, to) {
        var piece = this.pieces[from];
        if (this._isPawn(piece) || this.pieces[to]) {
            this.halfmove = 0;
        } else {
            this.halfmove++;
        }
    };

    Fen.prototype._updateEnPassant = function(from, to) {
        var piece = this.pieces[from];
        if (this._isPawn(piece)) {
            if (this.enPassant == to) {
                var dir = to.charAt(1) - from.charAt(1);
                delete this.pieces[to.charAt(0) + (to.charAt(1) - dir)];
            } else {
                var len = to.charAt(1) - from.charAt(1);
                if (Math.abs(len) == 2) {
                    this.enPassant = to.charAt(0) + (parseInt(from.charAt(1), 10) + (len / 2));
                    return;
                }
            }
        }
        this.enPassant = '-';
    };

    Fen.prototype._updateCastling = function(from, to) {
        if (!this.castling.length) {
            return false;
        }
        switch (from) {
            case 'a1': this.castling = __.without(this.castling, 'Q'); break;
            case 'a8': this.castling = __.without(this.castling, 'q'); break;
            case 'h1': this.castling = __.without(this.castling, 'K'); break;
            case 'h8': this.castling = __.without(this.castling, 'k'); break;
            case 'e1': 
                if (to == 'g1' && __.contains(this.castling, 'K')) {
                    this.pieces.f1 = this.pieces.h1;
                    delete this.pieces.h1;
                } else if (to == 'c1' && __.contains(this.castling, 'Q')) {
                    this.pieces.d1 = this.pieces.a1;
                    delete this.pieces.a1;
                }
                this.castling = __.without(this.castling, 'Q', 'K'); 
                break;
            case 'e8':
                if (to == 'g8' && __.contains(this.castling, 'k')) {
                    this.pieces.f8 = this.pieces.h8;
                    delete this.pieces.h8;
                } else if (to == 'c8' && __.contains(this.castling, 'q')) {
                    this.pieces.d8 = this.pieces.a8;
                    delete this.pieces.a8;
                }
                this.castling = __.without(this.castling, 'q', 'k'); 
                break;
        }
    };

    Fen.prototype._updatePiecePlacement = function(from, to) {
        var piece = this.pieces[from];
        delete(this.pieces[from]);

        if (this._isPawn(piece) && (to.charAt(1) ==  1 || to.charAt(1) == 8)) {
            this.pieces[to] = (piece == 'P' ? 'Q' : 'q');
        } else {
            this.pieces[to] = piece;
        }
    };

    Fen.prototype._updateActiveColor = function() {
        this.activeColor = this.activeColor == 'w' ? 'b' : 'w';
    };

    Fen.prototype._isPawn = function(piece) {
        return piece == 'p' || piece == 'P';
    };

    Fen.prototype._parse = function(fen) {
        var arr = fen.split ? fen.split(' ') : [];
        if (!arr || arr.length != 6) {
            throw new Error('A FEN must contain 6 space separated fields: ' + fen);
        }
        this._parsePiecePlacement(arr[0]);
        this._parseActiveColor(arr[1]);
        this._parseCastling(arr[2]);
        this._parseEnPassant(arr[3]);
        this._parseHalfmoveClock(arr[4]);
        this._parseFullmoveNumber(arr[5]);
    };

    Fen.prototype._parsePiecePlacement = function(str) {
        var arr = str.split('/');
        if (arr.length != 8) {
            throw new Error('A FEN must contain 8 ranks separated by /: ' + str);
        }
        var files = 'abcdefgh';
        var ranks = '87654321';
        __.each(arr, function(rank, rankIdx) {
            var fileIdx = 0;
            __.each(rank.split(''), function(p, i) {
                if (!p.match(/[0-8]/)) {
                    var an = files.charAt(fileIdx) + ranks.charAt(rankIdx);
                    this.pieces[an] = p;
                    fileIdx++;
                } else {
                    fileIdx += parseInt(p, 10);
                }
            }, this);
        }, this);
    };

    Fen.prototype._parseActiveColor = function(col) {
        if (col == 'w' || col == 'b') {
            this.activeColor = col;
        } else {
            throw new Exception('Illegal active color: ' + col);
        }
    };

    Fen.prototype._parseCastling = function(str) {
        if (str.match(/[kqKQ\-].*/)) {
            this.castling = str.split('');
        } else {
            throw new Error('Illegal castling string: ' + str);
        }
    };

    Fen.prototype._parseEnPassant = function(str) {
        this.enPassant = str;
    };

    Fen.prototype._parseHalfmoveClock = function(str) {
        this.halfmove = parseInt(str, 10);
    };

    Fen.prototype._parseFullmoveNumber = function(str) {
        this.fullmove = parseInt(str, 10);
    };  

    Fen.prototype.toString = function() {
        var fenString = this._readPlacement();   
        fenString += ' ' + this._readColourToMove();
        fenString += ' ' + this._readCastling();
        fenString += ' ' + this._readEnPassant();
        fenString += ' ' + this._readHalfMoves();
        fenString += ' ' + this._readFullMoves();
        return fenString;
    };

    Fen.prototype._readPlacement = function() {
        var str = '', board = {};
        __.each(__.range(8, 0, -1), function(rank) {
            var emptyCounter = 0;
            if(!__.isEmpty(str)) {  
                str += '/';
            }
            __.each(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], function(file) {
                var positions = __.keys(this.pieces);
                var square = file + rank;
                if(__.include(positions, square)){
                    var piece = this.pieces[square];
                    str += emptyCounter > 0 ? emptyCounter + piece : piece;
                    emptyCounter = 0;
                } else {
                    emptyCounter++;
                }
            }, this);
            if (emptyCounter) {
                str += emptyCounter;
            }
        }, this);

        return str;
    };

    Fen.prototype._readColourToMove = function() {
        return this.activeColor;
    };

    Fen.prototype._readCastling = function() {
        return !this.castling.length ? '-' : this.castling.join('');
    };

    Fen.prototype._readEnPassant = function() {
        return this.enPassant;
    };

    Fen.prototype._readHalfMoves = function(){
        return this.halfmove;
    };

    Fen.prototype._readFullMoves = function() {
        return this.fullmove;
    };

    return Fen;
});
