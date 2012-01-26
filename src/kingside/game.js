define(['underscore', '../../src/rex/rex', '../../src/fooboard/fooboard', './player'], 
    function(_, Rex, FooBoard, Player) {
    
    var Game = function(p1, p2, board) {
        this.rex = this._createRex();
        
        p1.onMove(this._bind(this.rex, 'move'));
        p2.onMove(this._bind(this.rex, 'move'));
        board.onMove(this._bind(this.rex, 'move'));
        
        this.rex.onMove(this._bind(p1, 'update'));
        this.rex.onMove(this._bind(p2, 'update'));
        this.rex.onMove(this._bind(board, 'update'));
    };
    
    Game.prototype.onMove = function(fn) {
        this.rex.onMove(fn);
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
    
    Factory.prototype.create = function(p1Type, p2Type, board, cb) {
        
        Player.create(p2Type, 'b', function(player2) {
            var col = player2.color == 'w' ? 'b' : 'w';
            Player.create(p1Type, col, function(player1) {
                board.render({
                    orientation: col
                });
                cb(new Game(player1, player2, board));
            });
        });
    };
    
    return new Factory();
    
});
