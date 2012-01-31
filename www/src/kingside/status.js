define(['underscore'], function(_) {
    
    var Status = function(opts) {
        this.dom = document.createElement('div');
        
        this.dom.className = 'status';
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
    
    Status.prototype.update = function(obj) {
        var state = obj.state;
        
        var me = obj.w.type == 'local' ? 'w' : 'b';
        var op = obj.w.type == 'local' ? 'b' : 'w';
        
        if (state.finished) {
            if (state.check) {
                if (obj.state.active_color == me) {
                    this._msg('checkmate, you lost');
                } else {
                    this._msg('checkmate, you won');
                }
            } else {
                this._msg('it\'s a draw');
            }
        } else {
            this._msg('playing against ' + obj[op].name);
        }
    };
    
    Status.prototype._msg = function(message) {
        this.dom.innerHTML = message;
    };
    
    return Status;
    
});