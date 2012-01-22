define('kingside', [
        'underscore',
        'src/kingside/game', 
        'src/kingside/login',
        'src/kingside/menu'
    ],
    function(_, Game, Login, Menu) {
    $(function() {
        var login = new Login();
        
        var game = new Game('local', 'garbo');
        
        var menu = new Menu();
        menu.onStart(_.bind(function(w, b) {
            game.destroy();
            game = new Game(w, b);
        }, this));
        
    });
});
