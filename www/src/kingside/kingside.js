define('underscore', function() {
    return _;
});

define('socket.io', function() {
    return io;
});

define('kingside', [
        'underscore',
        './game', 
        './login',
        './status',
        './auth',
        '../fooboard/fooboard',
        './socket',
        './service/gameService',
        '../../../src/event/pubsub',
        './ui/current_game',
        './ui/all_games',
        './ui/new_game',
        './ui/game_controls'
    ],
    function(_, Game, Login, Status, auth, FooBoard, socket, gameService, pubsub, CurrentGame, AllGames, NewGame, GameControls) {
        
    var Kingside = function() {
        
        this._status = new Status({ 
            target: $('.status').get()[0]
        });
        
        this._createFooBoard();

        gameService.onMove(_.bind(function(game) {
            // todo: do not update fooboard if the move was 
            // from another game than the current one
            pubsub.pub('/game/updated', game);
            this._status.update(game);
        }, this));
        
        gameService.onCreate(_.bind(function(game) {
            this._currentGame = game;
            // todo: we have the reference to fooboard
            // here, perhaps an explicit call is better
            pubsub.pub('/game/updated', this._currentGame);
            this._status.update(game);
        }, this));
        
        gameService.requestLocalGame({
            w: 'local', b: 'garbo'
        });

        
        var games = new AllGames();
        games.onClick(_.bind(function(gameIn) {
            var game = gameService.get(gameIn.gameId);
            this._currentGame = game;
            pubsub.pub('/game/updated', this._currentGame);
            this._status.update(game);
        }, this));
        
    };
    
    Kingside.prototype._createFooBoard = function() {
        var content = $('.board');
        var target = $('<div></div>');
        content.append(target);
        return new FooBoard(target.get()[0]);
    };

    $(function() {
        auth.getUser(function() {
            var login = new Login();
            var cg = new CurrentGame();
            var ng = new NewGame();
            var gc = new GameControls();
            var king = new Kingside();

            ng.onSelect(_.bind(function(white, black) {
                if (black == 'remote' && !auth.user) {
                    king._status.setMessage('You must log in to play online...');
                    return;
                }
                if (black == 'remote') {
                    king._status.setMessage('Searching for opponent...');
                    gameService.requestRemoteGame();
                } else {
                    gameService.requestLocalGame({w: white, b: black});
                }
            }, this));

        });
    });
});
