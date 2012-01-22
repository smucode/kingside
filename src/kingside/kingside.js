define('underscore', function() {
    return _;
});

define('kingside', [
        'underscore',
        './game', 
        './login',
        './menu',
        './status'
    ],
    function(_, Game, Login, Menu, Status) {
        
    var Kingside = function() {
        this._status = new Status({ target: $('.content').get()[0] });
        
        this._createGame('local', 'garbo');
                
        var menu = new Menu();
        menu.onStart(_.bind(function(w, b) {
            this._game.destroy();
            this._createGame(w, b);
        }, this));
    };
    
    Kingside.prototype._createGame = function(w, b) {
        Game.create(w, b, _.bind(function(game) {
            this._game = game;
            this._game.onMove(_.bind(this._status.update, this._status));
        }, this));
    };
        
    $(function() {
        new Login();
        new Kingside();
    });
});
