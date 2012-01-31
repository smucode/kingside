define([
        'underscore', 
        '../../../src/garbo/garbo',
        './remote',
        './auth'
    ], 
    function(_, Garbo, Remote, auth) {
    
    // local player
    
    var Local = function(color) {
        this._color = color;
        this.name = auth.getUser() ? auth.getUser().name : 'You';
        this.type = 'local';
    };
    
    Local.prototype.update = function() {};
    
    Local.prototype.onMove = function() {};
    
    Local.prototype.getColor = function() {
        return this._color;
    };
    
    Local.prototype.getGameId = function() {
        return 'localGameId';
    };

    // player factory
    
    var Factory = function() {};
    
    Factory.prototype.create = function(type, color, board, cb) {
        switch(type) {
            case 'garbo':
                cb(this._createGarbo(color)); break;
            case 'local':
                cb(this._createLocal(color)); break;
            case 'remote':
                Remote.create(board, cb); break;
            default:
                throw 'unknown player: ' + type;
        }
    };
    
    Factory.prototype._createGarbo = function(color) {
        return new Garbo(color);
    };
    
    Factory.prototype._createLocal = function(color) {
        return new Local(color);
    };
    
    return new Factory();
    
});
