define(['underscore', '../../../src/rex/rex', '../fooboard/fooboard', './player', '../../../src/event/pubsub'],
    function(_, Rex, FooBoard, Player, pubsub) {
    
    var Game = function(obj) {
        white = obj.w;
        black = obj.b;
        fen = obj.fen;
        
        this.id = Math.random();
        
        this.rex = this._createRex(fen);
        
        white.onMove(this._bind(this.rex, 'move'));
        black.onMove(this._bind(this.rex, 'move'));
        
        this._fbMoveHandler = _.bind(function(obj) {
            this.rex.move(obj.from, obj.to);
        }, this);
        
        pubsub.sub('/fooboard/move', this._fbMoveHandler);
        
        this.rex.onMove(this._bind(white, 'update'));
        this.rex.onMove(this._bind(black, 'update'));
        
        this.rex.onMove(_.bind(function(state) {
            state.gameId = this.id;
            pubsub.pub('/game/updated', state);
        }, this));
        
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
    
    Game.prototype._createRex = function(fen) {
        return new Rex(fen);
    };
    
    Game.prototype._bind = function(obj, name) {
        return _.bind(obj[name], obj);
    };
        
    // factory
    
    var Factory = function() {
    };
    
    Factory.prototype.create = function(def, cb) {
        
        Player.create(def.b, 'b', function(player2) {
            var col = player2.color == 'w' ? 'b' : 'w';
            Player.create(def.w, col, function(player1) {
                var game = new Game({
                    w: col == 'w' ? player1 : player2,
                    b: col == 'w' ? player2 : player1,
                    fen: def.fen
                });
                cb(game);
            });
        });
        
    };
    
    return new Factory();
    
});
