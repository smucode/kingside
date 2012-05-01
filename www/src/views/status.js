define(['underscore', 'backbone'], function(_, Backbone) {
    
    return Backbone.View.extend({

        el: $('#status'),

        initialize: function() {
            this.options.gameController.on('new', this._update, this);
            this.options.gameController.on('update', this._update, this);
        },
        
        _pieceAt: function(pos, board) {
            var code = board[pos];
            switch(code.toLowerCase()) {
                case 'p': return 'pawn';
                case 'k': return 'king';
                case 'r': return 'rook';
                case 'n': return 'knight';
                case 'b': return 'bishop';
                case 'q': return 'queen';
            }
        },
    
        _isCastling: function(from, to, board) {
            if (board[to] && board[to].toLowerCase()  == 'k') {
                switch (from + to) {
                    case 'e1g1':
                    case 'e8g8':
                        return 'kingside';
                    case 'e1c1':
                    case 'e8c8':
                        return 'queenside';
                }
            }
        },
        
        _update: function(game) {
            var state = game.get('state');
            
            if (state.finished) {
                if (state.check) {
                    if (this.options.auth.isMe(game[state.active_color])) {
                        this._msg('Checkmate, you lost.');
                    } else {
                        this._msg('Checkmate, you won.');
                    }
                } else {
                    this._msg('Game ended in a draw.');
                }
            } else {
                if (this.options.auth.isMe(game[state.active_color])) {
                    this._msg('It\'s your move.');
                } else {
                    this._msg('Waiting for the opponent.');
                }
            }
        },
        
        _msg: function(message) {
            this.$el.html(message);
        }
        
    });
    
});