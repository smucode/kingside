if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

define(["require", "vows", "assert", "underscore", "../Fen"], function(require, vows, assert, __, Fen) {

    vows.describe('Fen').addBatch({
        'creating a new Fen object' : {
            topic : new Fen(),
    
            'should have 32 pieces' : function(topic) {
                assert.equal(__.size(topic.pieces), 32);
            },
            
            'a1 should be a white rook' : function(topic) {
                assert.equal(topic.pieces.a1, 'R');
            },
            'a2 should be a white pawn' : function(topic) {
                assert.equal(topic.pieces.a2, 'P');
            },
            'b7 should be a black pawn' : function(topic) {
                assert.equal(topic.pieces.b7, 'p');
            },
            'c8 should be a black bishop' : function(topic) {
                assert.equal(topic.pieces.c8, 'b');
            },
            
            'the active color should be white' : function(topic) {
                assert.equal(topic.activeColor, 'w');
            },
            
            'all castling is allowed' : function(topic) {
                assert.equal(topic.castling.length, 4);
            },
            
            'there is no en passant move' : function(topic) {
                assert.equal(topic.enPassant, '-');
            },
            
            'the halfmove clock is zero' : function(topic) {
                assert.equal(topic.halfmove, 0);
            },
            
            'the fullmove number is one' : function(topic) {
                assert.equal(topic.fullmove, 1);
            }
            
        },
        'moving a piece' : {
            topic : new Fen(),
            
            'to a empty square should retain the number of pieces': function(topic) {
                topic.move('a2', 'a3');
                assert.equal(__.size(topic.pieces), 32);
            },
            
            'to a occupied square should reduce the number of pieces': function(topic) {
                topic.move('b1', 'b2');
                assert.equal(__.size(topic.pieces), 31);
            },
            'should change the active color': function(topic) {
                topic.move('c2', 'c3');
                assert.equal(topic.activeColor, 'b');
                
                topic.move('c3', 'c4');
                assert.equal(topic.activeColor, 'w');
            }
        },
        'given a full board 1' : {
            topic : new Fen(),
            
            'all castling should be allowed': function(topic) {
                assert.isTrue(topic.canCastle('K'));
                assert.isTrue(topic.canCastle('Q'));
                assert.isTrue(topic.canCastle('k'));
                assert.isTrue(topic.canCastle('q'));
            },
            'moving rook at a1 should disable white queenside castling': function(topic) {
                topic.move('a1', 'a2');
                assert.isTrue(topic.canCastle('K'));
                assert.isFalse(topic.canCastle('Q'));
                assert.isTrue(topic.canCastle('k'));
                assert.isTrue(topic.canCastle('q'));
            },
            'moving rook at h1 should disable white kingside castling': function(topic) {
                topic.move('h1', 'h2');
                assert.isFalse(topic.canCastle('K'));
                assert.isFalse(topic.canCastle('Q'));
                assert.isTrue(topic.canCastle('k'));
                assert.isTrue(topic.canCastle('q'));
            },
            'moving rook at a8 should disable black queenside castling': function(topic) {
                topic.move('a8', 'a7');
                assert.isFalse(topic.canCastle('K'));
                assert.isFalse(topic.canCastle('Q'));
                assert.isTrue(topic.canCastle('k'));
                assert.isFalse(topic.canCastle('q'));
            },
            'moving rook at h8 should disable black kingside castling': function(topic) {
                topic.move('h8', 'h7');
                assert.isFalse(topic.canCastle('K'));
                assert.isFalse(topic.canCastle('Q'));
                assert.isFalse(topic.canCastle('k'));
                assert.isFalse(topic.canCastle('q'));
            }
        },
        'given a full board 2' : {
            topic : new Fen(),
            
            'moving white king should disable all white castling': function(topic) {
                topic.move('e1', 'e2');
                assert.isFalse(topic.canCastle('K'));
                assert.isFalse(topic.canCastle('Q'));
                assert.isTrue(topic.canCastle('k'));
                assert.isTrue(topic.canCastle('q'));
            },
            'moving black king should disable all black castling': function(topic) {
                topic.move('e8', 'e7');
                assert.isFalse(topic.canCastle('K'));
                assert.isFalse(topic.canCastle('Q'));
                assert.isFalse(topic.canCastle('k'));
                assert.isFalse(topic.canCastle('q'));
            }
        },
        'given a full board 3' : {
            topic : new Fen(),
            
            'moving pawn at a2 to a4 should a3 should be marked as en passant square': function(topic) {
                topic.move('a2', 'a4');
                assert.equal(topic.enPassant, 'a3');
            },
            'moving pawn at h7 to h5 should h6 should be marked as en passant square': function(topic) {
                topic.move('h7', 'h5');
                assert.equal(topic.enPassant, 'h6');
            },
            'moving something else should remove en passant move': function(topic) {
                topic.move('a7', 'a6');
                assert.equal(topic.enPassant, '-');
                
                topic.move('b7', 'b2');
                assert.equal(topic.enPassant, '-');
            }
        },
        'given a full board 4' : {
            topic : new Fen(),
            
            'moving a pawn should reset the halfmove clock': function(topic) {
                assert.equal(topic.halfmove, 0);
                
                topic.move('a1', 'a3');
                assert.equal(topic.halfmove, 1);
                
                topic.move('a3', 'a4');
                assert.equal(topic.halfmove, 2);
                
                topic.move('a4', 'a5');
                assert.equal(topic.halfmove, 3);
                
                topic.move('a2', 'a3');
                assert.equal(topic.halfmove, 0);
            },
            
            'capturing a piece should reset the halfmove clock': function(topic) {
                assert.equal(topic.halfmove, 0);
                
                topic.move('b1', 'b3');
                assert.equal(topic.halfmove, 1);
                
                topic.move('b3', 'b4');
                assert.equal(topic.halfmove, 2);
                
                topic.move('b4', 'b5');
                assert.equal(topic.halfmove, 3);
                
                topic.move('b5', 'b7');
                assert.equal(topic.halfmove, 0);
            }
        },
        'given a full board' : {
            topic : new Fen(),
            
            'should update the full move clock after black moves': function(topic) {
                assert.equal(topic.fullmove, 1);
                assert.equal(topic.activeColor, 'w');
                
                topic.move('b1', 'b3');
                
                assert.equal(topic.fullmove, 1);
                assert.equal(topic.activeColor, 'b');
                
                topic.move('b3', 'b1');
                
                assert.equal(topic.fullmove, 2);
                assert.equal(topic.activeColor, 'w');
            }
        },
        'given a board where white can castle kingside': {
            topic: new Fen('8/8/8/8/8/8/8/4K2R w K - 0 1'),
            
            'castling should update internal board representation': function(topic) {
                topic.move('e1', 'g1');
                
                assert.equal(topic.pieces.g1, 'K');
                assert.equal(topic.pieces.f1, 'R');
            }
        },
        'given a board where white can castle queenside': {
            topic: new Fen('8/8/8/8/8/8/8/R3K3 w Q - 0 1'),
            
            'toString should yield the same': function(topic) {
                assert.equal(topic.toString(), '8/8/8/8/8/8/8/R3K3 w Q - 0 1');
            },

            
            'castling should update internal board representation': function(topic) {
                topic.move('e1', 'c1');
                
                assert.equal(topic.pieces.c1, 'K');
                assert.equal(topic.pieces.d1, 'R');
            }
        },
        'given a board where black can castle kingside': {
            topic: new Fen('4k2r/8/8/8/8/8/8/8 w k - 0 1'),
            
            'castling should update internal board representation': function(topic) {
                topic.move('e8', 'g8');
                
                assert.equal(topic.pieces.g8, 'k');
                assert.equal(topic.pieces.f8, 'r');
            }
        },
        'given a board where black can castle queenside': {
            topic: new Fen('r3k3/8/8/8/8/8/8/8 w q - 0 1'),
            
            'castling should update internal board representation': function(topic) {
                topic.move('e8', 'c8');
                
                assert.equal(topic.pieces.c8, 'k');
                assert.equal(topic.pieces.d8, 'r');
            }
        },
        'given a board where white can capture enpassant': {
            topic: new Fen('8/8/8/pP6/8/8/8/8 w - a6 0 1'),
            
            'capturing pawn should update board': function(topic) {
                topic.move('b5', 'a6');
                
                assert.equal(topic.pieces.a6, 'P');
                assert.isUndefined(topic.pieces.a5);
            }
        },
        'given a board where black can capture enpassant': {
            topic: new Fen('8/8/8/8/Pp6/8/8/8 b - a3 0 1'),
            
            'capturing pawn should update board': function(topic) {
                topic.move('b4', 'a3');
                
                assert.equal(topic.pieces.a3, 'p');
                assert.isUndefined(topic.pieces.a4);
            }
        },
        'given a board where white can be promoted': {
            topic: new Fen('8/P7/8/8/8/8/8/8 w - - 0 1'),
            
            'pawn should be promoted to queen': function(topic) {
                topic.move('a7', 'a8');
                assert.equal(topic.pieces.a8, 'Q');
            }
        },
        'given a board where black can be promoted': {
            topic: new Fen('8/8/8/8/8/8/p7/8 b - - 0 1'),
            
            'pawn should be promoted to queen': function(topic) {
                topic.move('a2', 'a1');
                assert.equal(topic.pieces.a1, 'q');
            }
        },
        'generate fen string from the fen object': {
            topic: new Fen('8/8/8/8/8/8/8/p7 b KQkq c5 0 1'),
            'to string with no move' : function(topic) {
                assert.equal(topic.toString(), '8/8/8/8/8/8/8/p7 b KQkq c5 0 1');
            },
            'test generate placement string': function(topic) {
                assert.equal(topic._readPlacement(), '8/8/8/8/8/8/8/p7');
            },
            'colour to move': function(topic) {
                assert.equal(topic._readColourToMove(), 'b');
            },
            'castling': function(topic) {
                assert.equal(topic._readCastling(), 'KQkq');
            },
            'en passant': function(topic) {
                assert.equal(topic._readEnPassant(), 'c5');
            },
            'half moves': function(topic) {
                assert.equal(topic._readHalfMoves(), '0');
            },
            'full moves': function(topic) {
                assert.equal(topic._readFullMoves(), '1');
            }
        },
        'generate fen string from where castling is invalidated': {
            topic: new Fen('8/8/8/8/8/8/8/4K2R b K - 0 1'),
            'to string with no move' : function(topic) {
                topic.move('e1', 'g1');
                assert.equal(topic._readCastling(), '-');
            }
        }
    
    })["export"](module);

});
