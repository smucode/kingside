define(['underscore', '../../../src/rex/rex', '../fooboard/fooboard', './player', '../../../src/event/pubsub'],
    function(_, Rex, FooBoard, Player, pubsub) {
    
    var Game = function(white, black) {
        this.rex = this._createRex();
        
        white.onMove(this._bind(this.rex, 'move'));
        black.onMove(this._bind(this.rex, 'move'));
        
        this._fbMoveHandler = _.bind(function(obj) {
            this.rex.move(obj.from, obj.to);
        }, this);
        
        pubsub.sub('/fooboard/move', this._fbMoveHandler);
        
        this.rex.onMove(this._bind(white, 'update'));
        this.rex.onMove(this._bind(black, 'update'));
        
        this.rex.onMove(function(state) {
            pubsub.pub('/game/updated', state);
        });
        
        this._white = white;
        this._black = black;
    };

    Game.prototype.destroy = function() {
        pubsub.desub('/fooboard/move', this._fbMoveHandler);
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
    
    Factory.prototype.create = function(p1Type, p2Type, cb) {
        Player.create(p2Type, 'b', function(player2) {
            var col = player2.color == 'w' ? 'b' : 'w';
            Player.create(p1Type, col, function(player1) {
                if (col == 'w') {
                    cb(new Game(player1, player2));
                } else {
                    cb(new Game(player2, player1));
                }
            });
        });
    };
    
    return new Factory();
    
});
