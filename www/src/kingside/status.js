define(['underscore', './auth'], function(_, auth) {
    
    var Status = function(opts) {
        this.dom = document.createElement('div');
        
        this.dom.innerHTML = 'awesome chess powa...';
        
        opts.target.appendChild(this.dom);
    };
    
    Status.prototype._pieceAt = function(pos, board) {
        var code = board[pos];
        switch(code.toLowerCase()) {
            case 'p': return 'pawn';
            case 'k': return 'king';
            case 'r': return 'rook';
            case 'n': return 'knight';
            case 'b': return 'bishop';
            case 'q': return 'queen';
        }
    };
    
    Status.prototype._isCastling = function(from, to, board) {
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
    };
    
    Status.prototype.setMessage = function(message) {
        this.dom.innerHTML = message;
    };
    
    Status.prototype.update = function(game) {
        var state = game.state;
        
        if (state.finished) {
            if (state.check) {
                if (auth.isMe(game[game.state.active_color])) {
                    this._msg('Checkmate, you lost.');
                } else {
                    this._msg('Checkmate, you won.');
                }
            } else {
                this._msg('Game ended in a draw.');
            }
        } else {
            if (auth.isMe(game[game.state.active_color])) {
                this._msg('It\'s your move.');
            } else {
                this._msg('Waiting for the opponent.');
            }
        }
    };
    
    Status.prototype._msg = function(message) {
        this.dom.innerHTML = message;
    };
    
    return Status;
    
});