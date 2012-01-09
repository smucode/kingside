define(['underscore'], function(_) {
	
	var FooBoard = function(opts) {
		opts = opts || {};
		
		this.squares = {};
		this.target = opts.target;
		this.pieces = opts.pieces || {};
		
		this.files = 'xabcdefgh'.split('');
		this.ranks = '87654321x'.split('');
		
		this._create();
		this.render();
	};
	
	// public
	
	FooBoard.prototype.render = function(target) {
		target = target || this.target;
		if (target) {
			target.appendChild(this.table);
		}
	};
	
	FooBoard.prototype.update = function(obj) {
		_.each(obj.board, function(piece, pos) {
			this._setImage(pos, piece);
		}, this);
	};
	
	// events
	
	FooBoard.prototype.onMove = function(from, to) {
	};
	
	// private
	
	FooBoard.prototype._create = function() {
		this.table = this._c('table');
		this.table.className = 'foo-board';
		_.each(this.ranks, function(rank) {
			var tr = this._c('tr');
			_.each(this.files, function(file) {
				var td = this._createTd(file, rank);
				if (file != 'x' || rank != 'x') {
    				this._makeDroppable(td);
				}
				tr.appendChild(td);
			}, this);
			this.table.appendChild(tr);
		}, this);
	};
	
	FooBoard.prototype._makeDroppable = function(node) {
	    var that = this;
	    $(node).droppable({
	        drop: function(event, ui) {
                var source = ui.draggable.parent().attr('_pos');
                var target = $(this).attr('_pos');
                
                if (source != target) {
    	            var img = ui.draggable.remove();
    	            that._setImage(target, img.attr('_type'));
                }
	        }
	    });
	};

	FooBoard.prototype._createTd = function(file, rank) {
		var td = this._c('td');
		if (file == 'x' || rank == 'x') {
			td.className = 'legend';
			td.innerHTML = (file != 'x' ? file : (rank != 'x' ? rank : '')).toUpperCase();
		} else {
			td.setAttribute('_pos', file + rank);
			td.className = this._getClassName(file, rank);
			this.squares[file + rank] = td;
		}
		return td; 
	};

	FooBoard.prototype._getClassName = function(file, rank) {
		var fileIdx = (_.indexOf(this.files, file) % 2);
		return fileIdx - (rank % 2) ? 'light' : 'dark';
	};
	
	FooBoard.prototype._setImage = function(pos, piece) {
		var td = this.squares[pos];
		var type = this._imgMap[piece];
		td.innerHTML = '<img src="img/' + type +'.png" _type=' + piece + ' />';
		$(td).find('img').draggable({
		    revert: true
		});
	};

	FooBoard.prototype._attachEvents = function() {
		$(this.table).find('img').draggable();
	};
	
	FooBoard.prototype._c = function(tagName) {
		return document.createElement(tagName);
	};
	
	FooBoard.prototype._imgMap = {
		r: 'br', n: 'bn', b: 'bb', q: 'bq', k: 'bk', p: 'bp',
		R: 'wr', N: 'wn', B: 'wb', Q: 'wq', K: 'wk', P: 'wp'
	};
	
	return FooBoard;
});
