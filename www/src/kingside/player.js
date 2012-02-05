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
        this.name = auth.user ? auth.user.name : 'You';
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
    
    Factory.prototype.create = function(type, color, cb) {
        switch(type) {
            case 'garbo':
                cb(this._createGarbo(color)); break;
            case 'local':
            case (auth.user ? auth.user.email : ''):
                cb(this._createLocal(color)); break;
            case 'remote':
                Remote.request(cb); break;
            default:
                cb(Remote.create(color, 'foo', type)); break;
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
