if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

define(["require", "exports", "module", "underscore","./Piece"], function(require, exports, module) {
var __ = require('underscore');

var Piece = require('./Piece').Piece;

var Queen = function(idx, color, board) {
	this.idx = idx;
	this.color = color;
	this.board = board;
	this.moves = [];
};

Queen.prototype = new Piece();

Queen.prototype.calculate = function() {
	this.addDirectionalMoves(this.OFFSETS);
};

Queen.prototype.OFFSETS = [-1, 1, 16 - 1, 16, 16 + 1, -16 - 1, -16, -16 + 1];

exports.Queen = Queen;

});
