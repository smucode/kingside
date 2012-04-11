define([
        'underscore', 
        '../socket', 
        '../../../../src/rex/Fen', 
        '../game/game',
        '../../../../src/event/pubsub',
        '../auth'
    ], function(_, socket, Fen, Game, pubsub, auth) {
    
    var GameService = function() {
        this.debug = true;
        
        this._games = {};
        
        this._listener = function() {};

		socket.on('game_ready', _.bind(function(game) {
			this.log('new game: ', game);
			var game = new Game(game);
			game.onMove(_.bind(this._gameMove, this));
			this._games[game.gameId] = game;
            this._createListener(game);
            this._listener(_.values(this._games));
        }, this));

        socket.on('move', _.bind(function(gameId, from, to) {
            this.log('move', arguments);
			var game = this._games[gameId];
			game.move(from, to);
			this._listener(_.values(this._games));
        }, this));
        
        pubsub.sub('/fooboard/move', _.bind(function(opts) {
            var game = this._games[opts.gameId];
            if (game.remote) {
                socket.emit('move', game.gameId, opts.from, opts.to);
            } else {
                game.move(opts.from, opts.to);                
            }
        }, this));
        
		this.list();
    };

    GameService.prototype.requestLocalGame = function(game) {
        var game = new Game(game);
        game.onMove(_.bind(this._gameMove, this));
        this._games[game.gameId] = game;
        this._createListener(game);
    };

    GameService.prototype.requestRemoteGame = function() {
        socket.emit('request_game');
    };

    GameService.prototype._gameMove = function(game) {
        console.log('game move', arguments);
        this._moveListener(game);
    };

    GameService.prototype.list = function(callback) {
		callback = callback || function() {};
		if (this._games.length) {
			callback(_.values(this._games));
		} else {
            $.getJSON('/games', _.bind(function(games) {
                this.log('got games: ', games);
				this.games = _.each(games, function(g){
					var game = new Game(g);
					game.onMove(_.bind(this._gameMove, this));
					this._games[game.gameId] = game;
				}, this);
				callback(_.values(this._games));
			}, this));			
		}
    };

	GameService.prototype.get = function(id) {
		return this._games[id];
	};
		
	GameService.prototype.log = function() {
		if (this.debug) {
			console.log.apply(console, arguments);
		}
    };
    
    GameService.prototype._notify = function() {
        this._listener(_.values(this.games));
    };
    
    GameService.prototype.onUpdate = function(fn) {
        this._listener = fn;
    };

    GameService.prototype.onMove = function(fn) {
        this._moveListener = fn;
    };

    GameService.prototype.onCreate = function(fn) {
        this._createListener = fn;
    };

    return new GameService();

});
