define([
        'underscore', 
        '../../src/garbo/garbo',
        './remote'
    ], 
    function(_, Garbo, Remote) {
    
    // local player
    
    var Local = function(color) {
        this._color = color; 
    };
    
    Local.prototype.update = function() {
        // game handles updates
    };
    
    Local.prototype.onMove = function() {
        // game handles moves
    };
    
    Local.prototype.getColor = function() {
        return this._color;
    };

    Local.prototype.getGameId = function() {
        return 'localGameId';
    };

    // player factory
    
    var Factory = function() {};
    
    Factory.prototype.create = function(type, color, cb) {
        switch(type) {
            case 'garbo':
                cb(this._createGarbo(color)); break;
            case 'local':
                cb(this._createLocal(color)); break;
            case 'remote':
                Remote.create(cb); break;
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
