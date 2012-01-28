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
        './menu',
        './save_game',
        './status',
        './auth',
        '../../src/fooboard/fooboard'
    ],
    function(_, Game, Login, Menu, SaveGame, Status, auth, FooBoard) {
        
    var Kingside = function() {
        this._status = new Status({ target: $('.content').get()[0] });
        
        this._createGame('local', 'garbo');

        var menu = new Menu();
        menu.onStart(_.bind(function(p1, p2) {
            this._createGame(p1, p2);
        }, this));
    };
    
    Kingside.prototype._createGame = function(p1, p2) {
        var loggedInUser = auth.getUser();
        if (p2 == 'remote' && !loggedInUser) {
            this._status.setMessage('You must log in to play online...');
        } else {
            if (this._board) {
                this._board.destroy();
            }
            this._board = this._createFooBoard();
            this._status.setMessage('Waiting for opponent...');
            Game.create(p1, p2, this._board, _.bind(function(game) {
                //Get in some user ids here
                this._game = game;
                this._game.onMove(_.bind(this._status.update, this._status));
                this._createSaveGame(game);
            }, this));
        }
    };
    
    Kingside.prototype._createFooBoard = function() {
        var content = $('.content');
        var target = $('<div></div>');
        content.append(target);
        return new FooBoard(target.get()[0]);
    };

    Kingside.prototype._createSaveGame = function(game) {
        var loggedInUser = auth.getUser();
        if(!game || !loggedInUser) {
            return;
        }
        new SaveGame(loggedInUser.email, game.rex);
    };

    $(function() {
        new Login();
        new Kingside();
    });
});
