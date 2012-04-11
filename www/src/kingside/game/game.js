define(['underscore', '../../../../src/rex/rex', '../../../../src/garbo/garbo'], function(_, Rex, Garbo) {

    var Game = function(game) {
        _.extend(this, game);
    
        if (!this.gameId) {
            this.gameId = Math.random().toString(16).substr(2);
            this.remote = false;
        } else {
            this.remote = true;
        }

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
            
            console.log('got move from rex', arguments);
            
            if (this._b) this._b.update(gameState);
            if (this._w) this._w.update(gameState);

            // when the initial rex event is removed, this check is surplus
            if (this._listener) this._listener(this);
            
        }, this));
    };

    // called by game when remote or fooboard makes a move
    Game.prototype.move = function(from, to) {
        console.log('fooboard moved', arguments);
        this._rex.move(from, to);
    };
    
    // used by gameservice to track changes
    Game.prototype.onMove = function(fn) {
        this._listener = fn;
    };

    return Game;

});