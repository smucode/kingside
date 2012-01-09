define('kingside', ['src/fooboard/fooboard', 'src/rex/Board'], function(FooBoard, Rex) {
	$(function() {
		var fb = new FooBoard({
			target: $('body')[0]
		});
		
		var rex = new Rex.Board();
		
		fb.update({
			board: rex._fen.pieces
		});
		
	});
});



// $.domReady(function() {
// 	
	// // todo: add support for require.js (elns)
	// // desperately need some sort of package system
// 	
	// var rex = require('./Board');
// 	
	// var ks = {};
// 	
	// // Board
// 	
	// ks.Board = function() {
		// this.rex = new rex.Board();
		// var fb = new FooBoard(this.rex._fen.pieces);
		// fb.render(document.getElementsByTagName('body')[0]);
// 		
		// bean.add(this, 'onMove', function(status) {
			// fb.move(status.from, status.to);
		// });
// 		
		// var getAn = function(img) {
			// return img.parentNode.getAttribute('xan');
		// };
// 		
		// var that = this;
		// var source = null;
// 		
		// $('img').dagron({
			// 'target': 'img',
			// 'start': function(img) {
				// var an = getAn(img);
				// source = an;
			// },
			// 'drop': function(img) {
				// var an = getAn(img);
				// that.move(source, an);
				// // b.move(source, an);
				// // fb.move(source, an);
			// }
		// });
	// };
// 	
	// ks.Board.prototype.move = function(from, to) {
		// try {
			// var status = this.rex.move(from, to);
			// bean.fire(this, 'onMove', status);
		// } catch (err) {
			// console.error(err)
			// bean.fire(this, 'onError', err);
		// }
	// };
// 	
	// // Computer
// 	
	// ks.Noobolainen = function(board) {
// 		
		// var b = board.rex;
// 		
		// bean.add(board, 'onMove', function(status) {
			// if (!status.finished && status.active == 'b') {
				// generateMove();
			// }
		// });
// 		
		// var generateMove = function() {
			// var pieces = __.shuffle(b._getPieces(b._getCurrentColor()));
			// var piece = __.find(pieces, function(p) {
				// return p.moves.length > 0;
			// });
			// if (piece) {
				// var target = __.shuffle(piece.moves)[0];
// 				
				// var move = __.map([piece.idx, target], b._idxToPos, b);
				// var x = b._getPieceAt(target);
				// if (x && x.type == 3) {
					// console.warn(move);
					// return;
				// }
// 				
				// console.log(b._fen.fullmove, move);
				// board.move.apply(board, move);
			// } else {
				// alert('wtf!');
			// }
		// };
	// };
// 	
	// var board = new ks.Board();
	// var cpu = new ks.Noobolainen(board);
// 	
// });
