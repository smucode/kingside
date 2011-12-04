var bean = require('bean');
var __ = require('underscore');

var FooBoard = function(pieces) {
	this.pieces = pieces || {};
	this.files = 'xabcdefgh'.split('');
	this.ranks = '87654321x'.split('');
	this._create();
};

// public

FooBoard.prototype.render = function(target) {
	target.appendChild(this.table);
};

// events

FooBoard.prototype.onClick = function(pos) {
};

// private

FooBoard.prototype._create = function() {
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
	
	bean.add(this.table, 'mousedown', __.bind(function(args) {
		var target = args.target;
		var pos = target.parentNode.getAttribute('xan');
		if (pos) {
			bean.fire(this, 'onClick', pos);
		}
	}, this));
};

FooBoard.prototype._formatCell = function(cell, file, rank) {
	if (file == 'x' || rank == 'x') {
		cell.className = 'legend';
		cell.innerHTML = (file != 'x' ? file : (rank != 'x' ? rank : '')).toUpperCase();
	} else {
		this._setId(cell, file, rank);
		this._setImage(cell, file, rank);
		this._setClassName(cell, file, rank);
	} 
};

FooBoard.prototype._setId = function(cell, file, rank) {
	cell.setAttribute('xan', file + rank);
};

FooBoard.prototype._setImage = function(cell, file, rank) {
	var p = this.pieces[file + rank];
	var type = p ? this._imgMap[p] : 'x';
	cell.innerHTML = '<img src="img/' + type +'.png" />';
};

FooBoard.prototype._setClassName = function(cell, file, rank) {
	var fileIdx = (__.indexOf(this.files, file) % 2);
	cell.className = fileIdx - (rank % 2) ? 'light' : 'dark';
};

FooBoard.prototype._c = function(tagName) {
	return document.createElement(tagName);
};

FooBoard.prototype._imgMap = {
	r: 'br', n: 'bn', b: 'bb', q: 'bq', k: 'bk', p: 'bp',
	R: 'wr', N: 'wn', B: 'wb', Q: 'wq', K: 'wk', P: 'wp'
};

if (typeof exports != 'undefined') {
	exports.FooBoard = FooBoard;
}
