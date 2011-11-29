var Pawn = function(idx, color, board) {
	this.idx = idx;
	this.color = color;
	this.board = board;
	this.moves = [];
};

Pawn.prototype.calculate = function() {
	var square = this.idx + (this.color * 16);
	if(this.board.isEmpty(square)) {
		this.moves.push(square);
		if((this.idx >= 16 && this.idx < 16 + 8) || (this.idx >= 96 && this.idx < 96 + 8)) {
			square = this.idx + (this.color * 32);
			
			if(this.board.isEmpty(square)) {
				this.moves.push(square);
			}
		}
	}
};

exports.Pawn = Pawn;
