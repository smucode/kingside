define(['underscore', 'src/rex/rex', 'src/fooboard/fooboard'], function(_, Rex, Board) {
    
    var Game = function(white, black) {
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
        throw 'not implemented';
    };
    
    // private
    
    Game.prototype._createRex = function() {
        return new Rex();
    };
    
    Game.prototype._bind = function(obj, name) {
        return _.bind(obj[name], obj);
    };
    
    // Game.prototype.start = function() {
        // socket.emit('/request_game');
    // };
    
    return Game;
    
});
