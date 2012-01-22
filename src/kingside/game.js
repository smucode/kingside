define(['underscore', '../../src/rex/rex', '../../src/fooboard/fooboard', './status', './player'], 
    function(_, Rex, FooBoard, Status, Player) {
    
    var Game = function(w, b) {
        var content = $('.content');
        this.target = $('<div></div>');
        content.append(this.target);
        
        var status = new Status({ target: this.target.get()[0] });
        
        var board = new FooBoard(w, b, this.target.get()[0]);
        var white = Player.create(w, 'w', board);
        var black = Player.create(b, 'b', board);
        
        this.rex = this._createRex();
        
        white.onMove(this._bind(this.rex, 'move'));
        black.onMove(this._bind(this.rex, 'move'));
        
        this.rex.onMove(this._bind(white, 'update'));
        this.rex.onMove(this._bind(black, 'update'));
        
        this.onMove(_.bind(status.update, status));
    };
    
    Game.prototype.onMove = function(fn) {
        this.rex.onMove(fn);
    };
    
    Game.prototype.destroy = function() {
        this.target.remove();
    };
    
    // private
    
    Game.prototype._createRex = function() {
        return new Rex();
    };
    
    Game.prototype._bind = function(obj, name) {
        return _.bind(obj[name], obj);
    };
    
    return Game;
    
});
