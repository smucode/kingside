var bean = require('bean');
var __ = require('underscore');

var FooBoard = function(pieces) {
	this.squares = {};
	this.pieces = pieces || {};
	this.files = 'xabcdefgh'.split('');
	this.ranks = '87654321x'.split('');
	
	this._create();
	this._attachEvents();
};

// public

FooBoard.prototype.render = function(target) {
	target.appendChild(this.table);
};

FooBoard.prototype.move = function(from, to, promotion) {
	var fp = this.squares[from];
	var tp = this.squares[to];
	
	// move images
	if (promotion) {
		tp.innerHTML = fp.innerHTML.indexOf('bp.png') != -1 ? '<img src="img/bq.png" />' : '<img src="img/wq.png" />'; 
	} else {
		tp.innerHTML = fp.innerHTML;
	}
	fp.innerHTML = '<img src="img/x.png" />';
};

FooBoard.prototype.highlight = function(squares) {
	__.each(this.squares, function(dom, sq) {
		var cl = dom.className;
		if (squares && squares.indexOf(sq) != -1) {
			dom.className = (cl.indexOf('light') != -1) ? 'light-hl' : 'dark-hl';
		} else {
			dom.className = (cl.indexOf('light') != -1) ? 'light' : 'dark';
		}
	}, this);
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
};
	
FooBoard.prototype._attachEvents = function() {
	bean.add(this.table, 'mousedown', __.bind(function(args) {
		var target = args.target;
		var pos = target.parentNode.getAttribute('xan');
		if (pos) {
			bean.fire(this, 'down', pos);
		}
	}, this));
	
	bean.add(this.table, 'mouseup', __.bind(function(args) {
		bean.fire(this, 'up');
	}, this));
	
	bean.add(this.table, 'mouseover', __.bind(function(args) {
		var target = args.target;
		var pos = target.parentNode.getAttribute('xan');
		if (pos) {
			bean.fire(this, 'over', pos);
		}
	}, this));
	
	bean.add(this.table, 'mouseout', __.bind(function(args) {
		bean.fire(this, 'out');
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
		this.squares[file + rank] = cell;
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
