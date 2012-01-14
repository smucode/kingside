if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

define(["underscore","./Fen","./PieceFactory"], function(__, Fen, Factory) {
  
  var Board = function(fen, event) {
        this._event = event;
        this._fen = new Fen(fen);
        this._board = new Array(128);
        
        __.each(this._fen.pieces, function(piece, pos) {
            var idx = this._posToIdx(pos);
            this._board[idx] = Factory.create(piece, idx, this);
        }, this);
        
        this._state = {};
        this._calculate();
    };
    
    Board.prototype = {
        
        WHITE: 1,
        BLACK: -1,
        
        _state: 'move',
        _files: 'abcdefgh',
        
        move: function(from, to) {
            var source = this._getPiece(from);
            this._verifyMove(source);
            
            var toIdx = this._posToIdx(to);
            this._verifyIndex(source, toIdx);
            
            this._state = {};
        
            if (source.canCapture(toIdx) || source.canMoveTo(toIdx)) {
                if (source.is('PAWN') && (toIdx < 9 || toIdx > 111)) {
                    this._promotePawn(from, to, source, toIdx);
                } else {
                    if (this._fen.enPassant == to) {
                        this._moveEnPassant(to, from);
                    }
                    this._updateArray(from, to);
                    this._fen.move(from, to);
                }
            } else {
                throw 'unable to move from ' + from + ' to ' + to;
            }
            
            if (this._fen.halfmove >= 50) {
                this._state.finished = 'halfmoves';
            } else {
                this._calculate();
            }
            
            this._state.to = to;
            this._state.from = from;
            this._state.active = this._fen.activeColor;
            
            this._event.fire('move');

            return this._state;
        },

        _verifyMove: function(source) {
            if (!source) {
                throw 'there is no piece to move';
            }
            if (this._getCurrentColor() != source.color) {
                throw 'cannot move out of order';
            }
        },
        _verifyIndex: function(source, toIdx) {
            if (source.moves.indexOf(toIdx) == -1) {
                throw 'illegal move';
            }
        },
        _promotePawn: function(from, to, source, toIdx) {
            this._fen.move(from, to);
            
            var fidx = this._posToIdx(from);
            this._board[fidx] = null;
            
            var pieceType = source.color == '1' ? 'Q' : 'q';
            this._board[toIdx] = Factory.create(pieceType, toIdx, this);
            this._state.promotion = pieceType;
        },
        _moveEnPassant: function(to, from) {
            this._state.enPassantCapture = to[0] + from[1];
        },
        getState: function() {
            return this._state;
        },
        
        _posToIdx: function(pos) {
            if (!pos || typeof pos != 'string' || !pos.match(/[a-h]{1}[0-8]{1}/)) {
                throw 'illegal pos ' + pos;
            }
            var c = this._files.indexOf(pos[0]);
            return c + ((pos[1] - 1) * 16);
        },
        
        _idxToPos: function(idx) {
            var file = idx % 16;
            var rank = Math.floor(idx / 16);
            var pos = this._files[file] + (rank + 1);
            if (typeof pos != 'string') {
                throw 'illegal idx ' + idx;
            }
            return pos;
        },
        
        _getPieceAt: function(idx) {
            return this._board[idx];
        },
        
        _getPieces: function(color) {
            return __.filter(this._board, function(p) {
                if (!color) {
                    return p;
                } else {
                    return p && p.color == color;
                }
            });
        },
        
        _getPiece: function(pos) {
            var idx = this._posToIdx(pos);
            return this._getPieceAt(idx);
        },
        
        _getCurrentColor: function() {
            return (this._fen.activeColor == 'w') ? this.WHITE : this.BLACK;
        },
        
        _calculate: function() {
            var currentColor = this._getCurrentColor();
            
            var moves = [];
            var attacked = [];
            
            __.each(this._getPieces(currentColor * -1), function(p) {
                p.calculate();
                attacked = __.union(attacked, p.attacks);
            });
            __.each(this._getPieces(currentColor), function(p) {
                p.calculate();
                moves = moves.concat(p.moves);
                if (p.type == 3 && attacked.indexOf(p.idx) != -1) {
                    this._state.check = true;
                }
            }, this);
            
            if (moves.length === 0) {
                if (this._state.check) {
                    this._state.finished = 'checkmate';
                } else {
                    this._state.finished = 'stalemate';
                }
            }
        },
        
        _updateArray: function(from, to) {
            var fidx = this._posToIdx(from);
            var fromPiece = this._board[fidx];
            this._board[fidx] = null;
            
            var tidx = this._posToIdx(to);
            fromPiece.idx = tidx;
            this._board[tidx] = fromPiece;
            
            this._updateCastling(from, to);
        },
        
        _updateCastling: function(from, to) {
            switch (from) {
                case 'e1': 
                    if (to == 'g1' && __.contains(this._fen.castling, 'K')) {
                        this._board[this._posToIdx('f1')] = this._board[this._posToIdx('h1')];
                        this._board[this._posToIdx('f1')].idx = this._posToIdx('f1');
                        this._board[this._posToIdx('h1')] = null;
                    } else if (to == 'c1' && __.contains(this._fen.castling, 'Q')) {
                        this._board[this._posToIdx('d1')] = this._board[this._posToIdx('a1')];
                        this._board[this._posToIdx('d1')].idx = this._posToIdx('d1');
                        this._board[this._posToIdx('a1')] = null;
                    }
                    break;
                case 'e8':
                    if (to == 'g8' && __.contains(this._fen.castling, 'k')) {
                        this._board[this._posToIdx('f8')] = this._board[this._posToIdx('h8')];
                        this._board[this._posToIdx('f8')].idx = this._posToIdx('f8');
                        this._board[this._posToIdx('h8')] = null;
                    } else if (to == 'c8' && __.contains(this._fen.castling, 'q')) {
                        this._board[this._posToIdx('d8')] = this._board[this._posToIdx('a8')];
                        this._board[this._posToIdx('d8')].idx = this._posToIdx('d8');
                        this._board[this._posToIdx('a8')] = null;
                    }
                    break;
            }
        },
        
        getCheckingPieces: function() {
            var currentColor = this._getCurrentColor();
            var pieces = this._getPieces(currentColor * -1);
            return __.filter(pieces, function(piece) {
                return piece.checks && piece.checks.length > 0;
            });
        },
        
        isPinned: function(idx) {
            var currentColor = this._getCurrentColor();
            var pieces = this._getPieces(currentColor * -1);
            
            var pinningPiece = __.detect(pieces, function(p) {
                return p.pinning && p.pinning[idx];
            });
            
            if (pinningPiece) {
                return __(pinningPiece.pinning[idx]).chain().clone().without(idx).union(pinningPiece.idx).value();
            }
        },
        
        isAttacked: function(idx) {
            var currentColor = this._getCurrentColor();
            return __.detect(this._getPieces(currentColor * -1), function(p) {
                return p.attacks.indexOf(idx) != -1;
            });
        },
        
        isProtected: function(idx) {
            var currentColor = this._getCurrentColor();
            return __.detect(this._getPieces(currentColor * -1), function(p) {
                return p.moves.indexOf(idx) != -1 || p.attacks.indexOf(idx) != -1;
            });
        },
        
        isEmpty: function(idx) {
            return !this._getPieceAt(idx);
        },
        
        isOnBoard: function(idx) {
            return idx >= 0 && idx < 127 && (idx & 0x88) === 0;
        },
        
        canCastle: function(code) {
            return this._fen.canCastle(code);
        },
        
        isEnPassant: function(idx) {
            var ep = this._fen.enPassant;
            if (ep && ep != '-') {
                var epIdx = this._posToIdx(ep);
                return idx == epIdx;
            }
            return false;
        },
        
        getMoves: function(pos) {
            var idx = this._posToIdx(pos);
            var piece = this._getPieceAt(idx);
            if (piece && piece.color == this._getCurrentColor()) {
                return __.map(piece.moves, function(idx) {
                    return this._idxToPos(idx);
                }, this);
            }
            return [];
        }
    };
    
    return Board;
    
});
