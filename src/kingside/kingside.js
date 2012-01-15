define('kingside', ['underscore', 'src/fooboard/fooboard', 'src/rex/Board', 'src/garbo/garbo', 'src/event/event', 'src/kingside/status'], function(_, FooBoard, Rex, Garbo, Event, Status) {
    $(function() {

        var status = new Status({
            target : $('.content')[0]
        });
        
        var fb = new FooBoard({
            target : $('.content')[0]
        });

        var rex = new Rex();
        
        rex.onMove(_.bind(status.update, status));
     
        var garbo = new Garbo();

        var gm = function() {
            var m = {};
            _.each(rex._getPieces(rex._getCurrentColor()), function(p) {
                if(p.moves.length > 0) {
                    var moves = _.map(p.moves, function(move) {
                        return rex._idxToPos(move);
                    });
                    m[rex._idxToPos(p.idx)] = moves;
                }
            });
            return m;
        };
        
        var updateFB = function() {
            var valid = gm();
            
            fb.update({
                board : rex._fen.pieces,
                valid_moves : valid
            });
        };
        
        updateFB();

        $(fb).bind('onMove', function(x, source, target) {
            rex.move(source, target);
            garbo.move(source, target);
            updateFB();
            
            garbo.search(function(from, to) {
                console.info('garbo: ', arguments);
                rex.move(from, to);
                updateFB();
            });
        });

    });
});
