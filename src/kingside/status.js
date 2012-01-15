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
    
    Status.prototype.update = function(obj) {
        
        if (!obj.finished) {
            if (obj.to) {
                var last_move = obj.active_color == 'b' ? 'white' : 'black';
                this.dom.innerHTML = last_move + ' moved ' + this._pieceAt(obj.to, obj.board) + ' at ' + obj.from + ' to ' + obj.to;
                
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