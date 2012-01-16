define('kingside', ['underscore', 'src/fooboard/fooboard', 'src/rex/Board', 'src/garbo/garbo',
        'src/event/event', 'src/kingside/status'], function(_, Dnode, FooBoard, Rex, Garbo, Event, Status) {
    $(function() {
        var target = $('.content')[0];

        var rex = new Rex();

        var dnode = require('node_modules/dnode/browser/bundle.js');

        dnode.connect(3000, function(remote) {
            remote.user(function(info){
                console.error('user info', info);
            });
        });
        
        var status = new Status({ target: target });
        rex.onMove(_.bind(status.update, status));
        
        var fb = new FooBoard({ target: target });
        rex.onMove(_.bind(fb.update, fb));
     
        var garbo = new Garbo();
        rex.onMove(function(o) {
            if (o.active_color == 'b') {
                garbo.move(o.from, o.to, o.promotion);
                garbo.search(function(from, to) {
                    // console.info('garbo: ', arguments);
                    rex.move(from, to);
                });
            }
        });
        

        $(fb).bind('onMove', function(x, source, target) {
            rex.move(source, target);
        });

    });
});
