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
        './status',
        './auth',
        '../../src/fooboard/fooboard',
        './games'
    ],
    function(_, Game, Login, Menu, Status, auth, FooBoard, Games) {
        
    var Kingside = function() {
        
        this._status = new Status({ 
            target: $('.content').get()[0]
        });
        
        var board = this._createFooBoard();
        board.render();
        
        this._createGame({w: 'local', b: 'garbo'});

        var menu = new Menu();
        menu.onStart(_.bind(function(p1, p2) {
            if (p2 == 'remote' && !auth.user) {
                this._status.setMessage('You must log in to play online...');
            } else {
                this._createGame({w: p1, b: p2});
            }
        }, this));
        
        var games = new Games();
        games.onClick(_.bind(this._createGame, this));

    };

    Kingside.prototype._createGame = function(obj) {
        this._status.setMessage('Waiting for opponent...');
        
        Game.create(obj, _.bind(function(game) {
            if (this._game) {
                this._game.destroy();
            }
            this._game = game;
            
            // hum, shoud use pubsub...
            this._game.onMove(_.bind(this._status.update, this._status));
        }, this));
        
    };
    
    Kingside.prototype._createFooBoard = function() {
        var content = $('.content');
        var target = $('<div></div>');
        content.append(target);
        return new FooBoard(target.get()[0]);
    };

    $(function() {
        auth.getUser(function() {
            new Login();
            new Kingside();
        });
    });
});