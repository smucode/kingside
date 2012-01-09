if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

define(["require", "exports", "module", "underscore","./Piece"], function(require, exports, module) {
var __ = require('underscore');

var Piece = require('./Piece').Piece;

var Rook = function(idx, color, board) {
	this.idx = idx;
	this.color = color;
	this.board = board;
	this.moves = [];
};

Rook.prototype = new Piece();

Rook.prototype.calculate = function() {
	this.addDirectionalMoves(this.DIRECTIONS);
};

Rook.prototype.DIRECTIONS = [1, -1, 16, -16];

exports.Rook = Rook;

});
