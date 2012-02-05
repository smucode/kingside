define(['underscore', './socket'], function(_, socket) {
    
    // remote
    
    var Remote = function(color, gameId, name) {
        this.name = name;
        this._color = color; 
        this._gameId = gameId;
        
        socket.on('move', _.bind(function(from, to) {
            console.log('socket move', arguments);
            this._listener(from, to);
        }, this));
    };
    
    Remote.prototype.update = function(obj) {
        if (obj.from) {
            console.log('emit move ', this._gameId, obj.from, obj.to);
            socket.emit('move', this._gameId, obj.from, obj.to);
        }
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
    
    Factory.prototype.create = function(color, gameId, name) {
        return new Remote(color, gameId, name);
    };
    
    Factory.prototype.request = function(cb) {
        socket.on('game_ready', function(color, gameId, name) {
            var remote = new Remote(color, gameId, name);
            cb(remote);
        });
        
        socket.emit('request_game');
    };
    
    return new Factory();
});
