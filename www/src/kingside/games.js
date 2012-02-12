define(['underscore', './timer', './panel', './auth', './socket', 'service/gameService', '../../../../src/rex/Fen'], 
	function(_, Timer, Panel, auth, socket, gameService, Fen) {

    var Games = function() {
        this._target = $('.games');

        gameService.list(_.bind(this._render, this));
        gameService.onUpdate(_.bind(this._render, this));
    };
    
	Games.prototype._render = function(games) {
        var my = [];
		var their = [];
		this._target.html('');
		
		console.log('render', games);
		
		_.each(games, function(game) {
			var fen = new Fen(game.fen);
			if (game.w == game.b) {
			    //todo: remove when db is nuked
				return;
			}
			if (game[fen.activeColor] == auth.user.email) {
				my.push(game);
			} else {
				their.push(game);
			}
		});
		
		if (my.length) {
			this._target.append('<div class="header">Your move:</div>');
			this._appendGames(my);
		}
		
		if (their.length) {
			this._target.append('<div class="header">Their move:</div>');
			this._appendGames(their);
		}
    };
	    
	Games.prototype._appendGames = function(games) {
		_.each(games, function(game) {
			var gameDom = this._createGameDom(game);
			this._target.append(gameDom);
		}, this);
	};
		
	Games.prototype._createGameDom = function(game) {
		var g = $('<div class="game"></div>').attr('id', game.gameId);
		var opponent = (game.w == auth.user.email) ? game.b : game.w;
		g.append($('<div>' + opponent + '</div>'));
		return g;
	};
			
	Games.prototype.onClick = function(fn) {
		this._target.bind('click', _.bind(function(e) {
			var id = $(e.target).parents('.game').attr('id');
			var game = gameService.get(id);
			fn(game);
		}, this));
	};

    return Games;
});
