define(['underscore', './garbochess.js'], function(_, Engine) {
    var Garbo = function(color, board) {
        this.color = color;
        this.engine = new Engine();
    };
    
    Garbo.prototype.update = function(o) {
        if (o.active_color == this.color) {
            this.engine.move(o.from, o.to, o.promotion);
            _.defer(_.bind(function() {
                this.engine.search(_.bind(function(from, to) {
                    this._listener(from, to);
                }, this));
            }, this), this);
        }
    };
    
    Garbo.prototype.onMove = function(fn) {
        this._listener = fn;
    };
    
    return Garbo;
});