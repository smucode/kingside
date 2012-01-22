define(['underscore', './socket'], function(_, socket) {
    
    // remote
    
    var Remote = function(color, board, gameId) {
        this._color = color; 
        this._board = board;
        this._gameId = gameId;
         
        // board.onMove(_.bind(this.move, this));
        // var that = this;
        // $(this._board).bind('onMove', function(x, source, target) {
            // todo check color
        //     that._listener(source, target);
        // });
    };
    
    Remote.prototype.update = function(obj) {
        if (obj.from) {
            socket.emit('move', this._gameId, obj.from, obj.to);
        }
        this._board.update(obj);
    };
    
    Remote.prototype.onMove = function(fn) {
        this._listener = fn;
    };
    
    Remote.prototype.getColor = function() {
        return this._color;
    };
        
    // factory
    
    var Factory = function() {
    };
    
    Factory.prototype.create = function(board, cb) {
        var remote = null;
        
        socket.on('game_ready', function(color, gameId) {
            remote = new Remote(color, board, gameId);
            cb(remote);
        });
        socket.on('move', function(from, to) {
            remote._listener(from, to);
        });
        socket.emit('request_game');
    };
    
    return new Factory();
});
