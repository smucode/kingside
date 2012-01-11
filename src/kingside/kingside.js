define('kingside', ['underscore', 'src/fooboard/fooboard', 'src/rex/Board', 'src/garbo/garbo'], function(_, FooBoard, Rex, Garbo) {
    $(function() {

        var fb = new FooBoard({
            target : $('body')[0]
        });

        var rex = new Rex();
        
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
            fb.update({
                board : rex._fen.pieces,
                valid_moves : gm()
            });
        };
        
        var generateMove = function() {
            var pieces = _.shuffle(rex._getPieces(rex._getCurrentColor()));
            var piece = _.find(pieces, function(p) {
                return p.moves.length > 0;
            });
            if(piece) {
                var target = _.shuffle(piece.moves)[0];
                var move = _.map([piece.idx, target], rex._idxToPos, rex);
                rex.move.apply(rex, move);
                updateFB();
            } else {
                alert((rex._getCurrentColor() != 1 ? 'white' : 'black') + ' won');
            }
        };
        
        updateFB();

        $(fb).bind('onMove', function(x, source, target) {
            rex.move(source, target);
            garbo.move(source, target);
            updateFB();
            
            // generateMove();
            garbo.search(function(from, to) {
                console.info('garbo: ', arguments);
                rex.move(from, to);
                updateFB();
            });
        });
        
    });
});