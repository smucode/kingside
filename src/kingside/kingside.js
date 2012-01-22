define('underscore', function() {
    return _;
});

define('kingside', [
        'underscore',
        './game', 
        './login',
        './menu',
        './status',
        './auth'
    ],
    function(_, Game, Login, Menu, Status, auth) {
        
    var Kingside = function() {
        this._status = new Status({ target: $('.content').get()[0] });
        
        this._createGame('local', 'garbo');
                
        var menu = new Menu();
        menu.onStart(_.bind(function(p1, p2) {
            this._game.destroy();
            this._createGame(p1, p2);
        }, this));
    };
    
    Kingside.prototype._createGame = function(p1, p2) {
        if (p2 == 'remote' && !auth.getUser()) {
            this._status.setMessage('You must log in to play online...');
        } else {
            this._status.setMessage('Waiting for opponent...');
            Game.create(p1, p2, _.bind(function(game) {
                this._game = game;
                this._game.onMove(_.bind(this._status.update, this._status));
            }, this));
        }
    };
        
    $(function() {
        new Login();
        new Kingside();
    });
});
