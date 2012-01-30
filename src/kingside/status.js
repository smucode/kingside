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
        
        var message = '';
        
        var castling = this._isCastling(state.from, state.to, state.board);
        var last_move = state.active_color == 'b' ? obj.w.name : obj.b.name;
        if (castling) {
            message = last_move + ' castled ' + castling;
        }
        else if (state.to) {
            message = last_move + ' moved ' + this._pieceAt(state.to, state.board) + ' on ' + state.from + ' to ' + state.to;
        } else {
            if (obj[state.active_color].type == 'local') {
                message = 'It\'s your move...';
            } else {
                var to_move = state.active_color == 'w' ? obj.w.name : obj.b.name;
                message = to_move + ' to move';
            }
        }
        if (state.check) {
            if (state.finished) {
                message += ', checkmate!!';
            } else {
                message += ', check!';
            }
        } else if (state.finished) {
            message += ', stalemate!';
        }
        
        message = 'Playing against ' + (obj.w.type == 'local' ? obj.b.name : obj.w.name) + ', ' + message;
        
        this.dom.innerHTML = message;
    };
    
    return Status;
    
});