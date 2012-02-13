define(['underscore', '../../../../src/rex/rex', '../../../../src/garbo/garbo'], function(_, Rex, Garbo) {

    var LocalGame = function(game) {
        _.extend(this, game);
        
        this.gameId = Math.random().toString(16).substr(2);

        if (this.b == 'garbo') {
            this._b = new Garbo('b');
            this._b.onMove(_.bind(this.move, this));
        }
        
        if (this.w == 'garbo') {
            this._w = new Garbo('w');
            this._w.onMove(_.bind(this.move, this));
        }
    
        this._rex = new Rex(this.fen);
        this._rex.onMove(_.bind(function(gameState) {
            this.state = gameState;
            
            if (this._b) this._b.update(gameState);
            if (this._w) this._w.update(gameState);
            
            console.log('got move from rex', arguments);
            
            // when the initial rex event is removed, this check is surplus
            if (this._listener) {
                this._listener(this);
            }
        }, this));

    };

    // called by game when fooboard makes a move
    LocalGame.prototype.move = function(from, to) {
        console.log('fooboard moved', arguments);
        this._rex.move(from, to);
    };
    
    // used by gameservice to track changes
    LocalGame.prototype.onMove = function(fn) {
        this._listener = fn;
    };

    return LocalGame;

});