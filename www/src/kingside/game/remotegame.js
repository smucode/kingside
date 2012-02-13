define(['underscore', '../../../../src/rex/rex', '../../../../src/garbo/garbo'], function(_, Rex, Garbo) {

    var RemoteGame = function(game) {
        _.extend(this, game);
    
        this.remote = true;
    
        this._rex = new Rex(this.fen);
        this._rex.onMove(_.bind(function(gameState) {
            this.state = gameState;
            
            console.log('got move from rex', arguments);
            
            // when the initial rex event is removed, this check is surplus
            if (this._listener) this._listener(this);
            
        }, this));
    };

    // called by game when remote or fooboard makes a move
    RemoteGame.prototype.move = function(from, to) {
        console.log('fooboard moved', arguments);
        this._rex.move(from, to);
    };
    
    // used by gameservice to track changes
    RemoteGame.prototype.onMove = function(fn) {
        this._listener = fn;
    };

    return RemoteGame;

});