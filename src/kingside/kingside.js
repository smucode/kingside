define('kingside', [
    'underscore', 
    'src/fooboard/fooboard',
    'src/rex/Board',
    'src/garbo/garbo',
    'src/event/event',
    'src/kingside/status',
    'src/kingside/auth'
    ], 
    function(_, FooBoard, Rex, Garbo, Event, Status, Auth) {
    $(function() {
        var target = $('.content')[0];
       
        var rex = new Rex();

        var status = new Status({ target: target });
        rex.onMove(_.bind(status.update, status));
        
        var fb = new FooBoard({ target: target });
        rex.onMove(_.bind(fb.update, fb));
     
        var garbo = new Garbo();
        rex.onMove(function(o) {
            if (o.active_color == 'b') {
                garbo.move(o.from, o.to, o.promotion);
                _.defer(function() {
                    garbo.search(function(from, to) {
                        rex.move(from, to);
                    });
                });
            }
        });

        $(fb).bind('onMove', function(x, source, target) {
            rex.move(source, target);
        });

        var link = $('<a href="auth/google/">login</a>');
        $('.login').append(link);
        
        var auth = new Auth();
        auth.onAuth(function(user) {
            link.html(user.email);
        });
    });
});
