define(['underscore', './garbochess.js'], function(_, Engine) {
    var Garbo = function(color, board) {
        this._color = color;
        this._board = board;
        this._engine = new Engine();
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
        } else {
            this._board.update(obj);
        }
    };
    
    Garbo.prototype.onMove = function(fn) {
        this._listener = fn;
    };
    
    Garbo.prototype.getColor = function() {
        return this._color;
    };

    return Garbo;
});