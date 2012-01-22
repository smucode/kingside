define([
        'underscore', 
        '../../src/garbo/garbo'
    ], 
    function(_, Garbo) {
    
    // local player
    
    var Local = function(color, board) {
        this._color = color; 
        this._board = board;
         
        // board.onMove(_.bind(this.move, this));
        var that = this;
        $(this._board).bind('onMove', function(x, source, target) {
            // todo check color
            that._listener(source, target);
        });
    };
    
    Local.prototype.update = function(obj) {
        this._board.update(obj);
    };
    
    Local.prototype.onMove = function(fn) {
        this._listener = fn;
    };

    // player factory
    
    var Factory = function() {};
    
    Factory.prototype.create = function(type, color, board) {
        switch(type) {
            case 'garbo':
                return this._createGarbo(color, board);
            case 'local':
                return this._createLocal(color, board);
            default:
                throw 'unknown player: ' + type;
        }
    };
    
    Factory.prototype._createGarbo = function(color, board) {
        return new Garbo(color, board);
    };
    
    Factory.prototype._createLocal = function(color, board) {
        return new Local(color, board);
    };
    
    return new Factory();
    
});
