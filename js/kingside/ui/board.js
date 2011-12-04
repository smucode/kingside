var __ = require('underscore');

var Board = function(pieces) {
	this.pieces = pieces || {};
	this.files = 'xabcdefgh'.split('');
	this.ranks = '87654321x'.split('');
	this._create();
};

Board.prototype.render = function(target) {
	target.appendChild(this.table);
};

Board.prototype.move = function(from, to) {};

Board.prototype.remove = function(pos) {};

Board.prototype._create = function() {
	this.table = this._c('table');
	this.table.className = 'foo-board';
	__.each(this.ranks, function(rank) {
		var tr = this._c('tr');
		__.each(this.files, function(file) {
			var td = this._c('td');
			this._formatCell(td, file, rank);
			tr.appendChild(td);
		}, this);
		this.table.appendChild(tr);
	}, this);
};

Board.prototype._formatCell = function(cell, file, rank) {
	if (file == 'x' || rank == 'x') {
		cell.className = 'legend';
		cell.innerHTML = (file != 'x' ? file : (rank != 'x' ? rank : '')).toUpperCase();
	} else {
		this._setImage(cell, file, rank);
		this._setClassName(cell, file, rank);
	} 
};

Board.prototype._setImage = function(cell, file, rank) {
	var p = this.pieces[file + rank];
	var type = p ? this._imgMap[p] : 'x';
	cell.innerHTML = '<img src="img/' + type +'.png" />';
};

Board.prototype._setClassName = function(cell, file, rank) {
	var fileIdx = (__.indexOf(this.files, file) % 2);
	cell.className = fileIdx - (rank % 2) ? 'light' : 'dark';
};

Board.prototype._c = function(tagName) {
	return document.createElement(tagName);
};

Board.prototype._imgMap = {
	r: 'br', n: 'bn', b: 'bb', q: 'bq', k: 'bk', p: 'bp',
	R: 'wr', N: 'wn', B: 'wb', Q: 'wq', K: 'wk', P: 'wp'
};

if (typeof exports != 'undefined') {
	exports.Board = Board;
}