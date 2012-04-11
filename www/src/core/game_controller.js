define(['underscore', '../model/game'], function(_, Game) {
	
	var Games = Backbone.Collection.extend({
		model: Game
	});

	var GC = function(mediator) {
		this._mediator = mediator;

		mediator.on('start', this._init, this);

		this._games = new Games();

		this._games.on('move', _.bind(function(gameId, from, to) {
			var game = this._games.get(gameId);
			console.log('gc move', arguments);
			game.move(from, to);
			this.trigger('update', game);
		}, this));
	};

	GC.prototype._init = function() {
		this.trigger('new', this._createGame());
	};

	GC.prototype._createGame = function() {
		var game = new Game();
		this._games.add(game);
		return game;
	};

	_.extend(GC.prototype, Backbone.Events);

	return GC;

});