define(['underscore', '../model/game'], function(_, Game) {
    
    var Games = Backbone.Collection.extend({
        model: Game
    });

    var GC = function(mediator) {
        this._mediator = mediator;

        mediator.on('start', this._init, this);

        this._games = new Games();

        this._games.on('move', _.bind(function(gameId, from, to) {
            console.log('games move', arguments)
            var game = this._games.get(gameId);
            this.trigger('update', game);
        }, this));

        this._games.on('add', _.bind(function(game) {
            this.trigger('new', game);
        }, this));
    };

    GC.prototype._init = function() {
        this.createGame('local', 'garbo');
    };

    GC.prototype.createGame = function(w, b) {
        var game = new Game({ 
            w: w, 
            b: b,
            id: Math.random().toString(16).substr(2)
        });
        this._games.add(game);
        return game;
    };

    _.extend(GC.prototype, Backbone.Events);

    return GC;

});