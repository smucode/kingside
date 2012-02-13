define(['underscore', '../../lib/garbo/garbochess.js'], function(_, Engine) {
    var Garbo = function(color) {
        this._color = color;
        this._engine = new Engine();
        this.name = 'the computer';
    };
    
    Garbo.prototype.update = function(obj) {
        if (obj.active_color == this._color) {
            if (obj.from) {
                this._engine.move(obj.from, obj.to, obj.promotion);
            }
            _.defer(_.bind(function() {
                this._engine.search(_.bind(function(from, to) {
                    this._listener(from, to);
                }, this));
            }, this));
        }
    };
    
    Garbo.prototype.onMove = function(fn) {
        this._listener = fn;
    };
    
    Garbo.prototype.getColor = function() {
        return this._color;
    };

    Garbo.prototype.getGameId = function() {
        return 'garboId';
    };

    return Garbo;
});