$.domReady(function() {
	
	var rex = require('./Board');
	var b = new rex.Board();
	
	var fb = new FooBoard(b._fen.pieces);
	fb.render(document.getElementsByTagName('body')[0]);
	
	bean.add(fb, 'down', function(pos) {
		var moves = b.getMoves(pos);
		if (moves && moves.length > 0) {
			moves.push(pos);
		}
		fb.highlight(moves);
	});
	
	bean.add(fb, 'up', function() {
		fb.highlight();
	});
	
	bean.add(fb, 'over', function(pos) {
		var moves = b.getMoves(pos);
		if (moves && moves.length > 0) {
			fb.highlight([pos]);
		}
	});
	
	bean.add(fb, 'out', function() {
		fb.highlight();
	});
	
	var generateMove = function() {
		if (b._fen.halfmove > 50) {
			console.log('halfmoves');
			return;
		}
		var pieces = __.shuffle(b._getPieces(b._getCurrentColor()));
		var piece = __.find(pieces, function(p) {
			return p.moves.length > 0;
		});
		if (piece) {
			var target = __.shuffle(piece.moves)[0];
			
			var move = __.map([piece.idx, target], b._idxToPos, b);
			var x = b._getPieceAt(target);
			if (x && x.type == 3) {
				console.warn(move);
				return;
			}
			
			console.log(b._fen.fullmove, move);
			var m = b.move.apply(b, move);
			
			if (m.status == 'promotion') {
				move.push(true);
			}
			fb.move.apply(fb, move);
			
			__.delay(generateMove, 100);
		} else {
			console.log('mate!');
		}
	};
			
	generateMove();
	
});
