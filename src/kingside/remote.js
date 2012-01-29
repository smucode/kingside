define(['underscore', './socket'], function(_, socket) {
    
    // remote
    
    var Remote = function(color, board, gameId, name) {
        this._color = color; 
        this._board = board;
        this._gameId = gameId;
        
        this.name = name;
        
        socket.on('move', _.bind(function(from, to) {
            this._listener(from, to);
        }, this));
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

    Remote.prototype.getGameId = function() {
        return this._gameId;
    };
        
    // factory
    
    var Factory = function() {
    };
    
    Factory.prototype.create = function(board, cb) {
        socket.on('game_ready', function(color, gameId, name) {
            var remote = new Remote(color, board, gameId, name);
            cb(remote);
        });
        
        socket.emit('request_game');
    };
    
    return new Factory();
});
