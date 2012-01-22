define([
        'underscore', 
        '../../src/garbo/garbo',
        './remote'
    ], 
    function(_, Garbo, Remote) {
    
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
    
    Factory.prototype.create = function(type, color, board, cb) {
        switch(type) {
            case 'garbo':
                cb(this._createGarbo(color, board)); break;
            case 'local':
                cb(this._createLocal(color, board)); break;
            case 'remote':
                Remote.create(color, board, cb); break;
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
