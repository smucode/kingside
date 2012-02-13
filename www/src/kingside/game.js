define(['underscore', '../../../src/rex/rex', './player', '../../../src/event/pubsub', './socket'],
    function(_, Rex, Player, pubsub, socket) {
    
    var Game = function(obj) {
        var white = obj.w;
        var black = obj.b;
        var fen = obj.fen;
        
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
            pubsub.pub('/game/updated', state, obj);
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
    
    Game.prototype._createRex = function(fen) {
        return new Rex(fen);
    };
    
    Game.prototype._bind = function(obj, name) {
        return _.bind(obj[name], obj);
    };
    
    // remote game
    
    var RemoteGame = function(def) {
    };
    
    RemoteGame.prototype.move = function() {
    };
    
    // factory
    
    var Factory = function() {
    };
    
    Factory.prototype.request = function() {
        socket.emit('request_game');
    };
    
    Factory.prototype.create = function(def, cb) {
        if (def.gameId) {
            var game = new RemoteGame(def);
            cb(game);
            return;
        }
        Player.create(def.b, 'b', def.gameId, function(player2) {
            var col = player2.color == 'w' ? 'b' : 'w';

            Player.create(def.w, col, def.gameId, function(player1) {
                // todo: not good...
                def.w = col == 'w' ? player1 : player2;
                def.b = col == 'w' ? player2 : player1;
                var game = new Game(def);
                cb(game);
            });
        });
    };
    
    return new Factory();
    
});
