define(['underscore', '../../src/rex/rex', '../../src/fooboard/fooboard', './player'], 
    function(_, Rex, FooBoard, Player) {
    
    var Game = function(p1, p2, target) {
        this._target = target;
        this.rex = this._createRex();
        
        p1.onMove(this._bind(this.rex, 'move'));
        p2.onMove(this._bind(this.rex, 'move'));
        
        this.rex.onMove(this._bind(p1, 'update'));
        this.rex.onMove(this._bind(p2, 'update'));
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
    
    Factory.prototype.create = function(p1, p2, cb) {
        var content = $('.content');
        var target = $('<div></div>');
        content.append(target);
        
        var board = new FooBoard(target.get()[0]);
        
        var p1Col = 'w';
        var p2Col = 'b';
        
        // lol..
        Player.create(p2, p2Col, board, function(player2) {
            if (player2.getColor() != p2Col) {
                p1Col = p2Col;
            }
            Player.create(p1, p1Col, board, function(player1) {
                board.render(p1Col);
                cb(new Game(player1, player2, target));
            });
        });
        
    };
    
    return new Factory();
    
});
