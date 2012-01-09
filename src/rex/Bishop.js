if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

define(["require", "exports", "module", "underscore","./Piece"], function(require, exports, module) {
var __ = require('underscore');

var Piece = require('./Piece').Piece;

var Bishop = function(idx, color, board) {
	this.idx = idx;
	this.color = color;
	this.board = board;
	this.moves = [];
};

Bishop.prototype = new Piece();

Bishop.prototype.calculate = function() {
	this.addDirectionalMoves(this.OFFSETS);
};

Bishop.prototype.OFFSETS = [16 - 1, 16 + 1, -16 - 1, -16 + 1];

exports.Bishop = Bishop;

});
