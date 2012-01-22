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
        if (!obj.finished) {
            var castling = this._isCastling(obj.from, obj.to, obj.board);
            var last_move = obj.active_color == 'b' ? 'white' : 'black';
            if (castling) {
                this.dom.innerHTML = last_move + ' castled ' + castling;
            }
            else if (obj.to) {
                this.dom.innerHTML = last_move + ' moved ' + this._pieceAt(obj.to, obj.board) + ' on ' + obj.from + ' to ' + obj.to;
                
            } else {
                var to_move = obj.active_color == 'w' ? 'white' : 'black';
                this.dom.innerHTML = to_move + ' to move';
            }
        } else {
            var winner = obj.active_color == 'b' ? 'white' : 'black';
            this.dom.innerHTML = winner + ' won';
        }
    };
    
    return Status;
    
});