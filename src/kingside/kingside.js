define('kingside', [
        'underscore' , 
        'src/fooboard/fooboard', 
        'src/kingside/status', 
        'src/kingside/auth', 
        'src/kingside/game', 
        'src/kingside/player'
    ],
    function(_, FooBoard, Status, Auth, Game, Player) {
    $(function() {
        
        var target = $('.content')[0];
        var status = new Status({ target: target });
        
        var board = new FooBoard(white, black, target);
        var white = Player.create('local', 'w', board);
        var black = Player.create('garbo', 'b', board);
        var game = new Game(white, black);
        
        // todo: refactor below
        game.onMove(_.bind(status.update, status));

        var link = $('<a href="auth/google/">login</a>');
        $('.login').append(link);
        
        var auth = new Auth();
        auth.onAuth(function(user) {
            link.html(user.email);
        });
    });
});
