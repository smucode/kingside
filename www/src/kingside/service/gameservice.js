define(['underscore', '../socket', '../../../../src/rex/Fen'], function(_, socket, Fen) {
    
    var GameService = function() {
        this.debug = false;
        
        this._listener = function() {};
	
		socket.on('game_ready', _.bind(function(game) {
			this.log('new game: ', game);
			this.games[game.gameId] = game;
			this._notify();
        }, this));

        socket.on('move', _.bind(function(gameId, from, to) {
            this.log('move', arguments);
			var game = this.games[gameId];
			try {
    			var fen = new Fen(game.fen);
    			fen.move(from, to);
    			game.fen = fen.toString();			    
			} catch (e) {
			    console.log(e);
			}
			this.games[gameId] = game;
			this._notify();
        }, this));

		this.list();
    };

    GameService.prototype.list = function(callback) {
		callback = callback || function() {};
		if (this.games) {
			callback(_.values(this.games));
		} else {
            $.getJSON('/games', _.bind(function(games) {
                this.log('got games: ', games);
				var gameMap = {};
				this.games = _.each(games, function(game){
					gameMap[game.gameId] = game;
				});
				this.games = gameMap;
				callback(_.values(this.games));
			}, this));			
		}
    };

	GameService.prototype.get = function(id) {
		return this.games[id];
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

    return new GameService();

});
