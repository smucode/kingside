define(['underscore', '../../../src/rex/rex', '../../src/fooboard/fooboard', './player'],
    function(_, Rex, FooBoard, Player, SaveGame) {
    
    var Game = function(white, black, board) {
        this.rex = this._createRex();
        
        white.onMove(this._bind(this.rex, 'move'));
        black.onMove(this._bind(this.rex, 'move'));
        board.onMove(this._bind(this.rex, 'move'));
        
        this.rex.onMove(this._bind(white, 'update'));
        this.rex.onMove(this._bind(black, 'update'));
        this.rex.onMove(this._bind(board, 'update'));
        
        this._white = white;
        this._black = black;
    };

    Game.prototype.onMove = function(fn) {
        var that = this;
        this.rex.onMove(function(state) {
            fn({
                w: that._white,
                b: that._black,
                state: state
            });
        });
    };    
    
    // private
    
    Game.prototype._createRex = function() {
        return new Rex();
    };
    
    Game.prototype._bind = function(obj, name) {
        return _.bind(obj[name], obj);
    };
        
    // factory
    
    var Factory = function() {};
    
    Factory.prototype.create = function(p1Type, p2Type, board, cb) {
        Player.create(p2Type, 'b', board, function(player2) {
            var col = player2.color == 'w' ? 'b' : 'w';
            Player.create(p1Type, col, board, function(player1) {
                board.render({
                    orientation: col
                });
                if (col == 'w') {
                    cb(new Game(player1, player2, board));
                } else {
                    cb(new Game(player2, player1, board));
                }
            });
        });
    };
    
    return new Factory();
    
});
