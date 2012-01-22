define(['underscore', '../../src/rex/rex', '../../src/fooboard/fooboard', './player'], 
    function(_, Rex, FooBoard, Player) {
    
    var Game = function(white, black, target) {
        this._target = target;
        this.rex = this._createRex();
        
        white.onMove(this._bind(this.rex, 'move'));
        black.onMove(this._bind(this.rex, 'move'));
        
        this.rex.onMove(this._bind(white, 'update'));
        this.rex.onMove(this._bind(black, 'update'));
    };
    
    Game.prototype.onMove = function(fn) {
        this.rex.onMove(fn);
    };
    
    Game.prototype.destroy = function() {
        this._target.remove();
    };
    
    // private
    
    Game.prototype._createRex = function() {
        return new Rex();
    };
    
    Game.prototype._bind = function(obj, name) {
        return _.bind(obj[name], obj);
    };
        
    // factory
    
    var Factory = function() {
    };
    
    Factory.prototype.create = function(w, b, cb) {
        var content = $('.content');
        var target = $('<div></div>');
        content.append(target);
        
        var board = new FooBoard(w, b, target.get()[0]);
        
        // lol..
        Player.create(w, 'w', board, function(white) {
            Player.create(b, 'b', board, function(black) {
                cb(new Game(white, black, target));
            });
        });
        
    };
    
    return new Factory();
    
});
