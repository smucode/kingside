define(['underscore'], function(_) {

    var FooBoard = function(opts) {
        opts = opts || {};

        this.board = {};
        this.pieces = {};
        this.squares = {};
        this.selected = null;
        
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
        if(target) {
            target.appendChild(this.table);
        }
    };

    FooBoard.prototype.update = function(obj) {
        _.each(this.squares, function(td, pos) {
            if (obj.board[pos]) {
                this._setImage(pos, obj.board[pos]);
            } else {
                $(td).find('img').remove();
                delete this.pieces[pos];
            }
        }, this);
        this.board = obj;
    };
    
    // private

    FooBoard.prototype._create = function() {
        this.table = this._c('table');
        this.table.className = 'foo-board';
        _.each(this.ranks, function(rank) {
            var tr = this._c('tr');
            _.each(this.files, function(file) {
                var td = this._createTd(file, rank);
                if(file != 'x' || rank != 'x') {
                    this._makeDroppable(td);
                }
                tr.appendChild(td);
            }, this);
            this.table.appendChild(tr);
        }, this);
        this._attachEvents();
    };

    FooBoard.prototype._makeDroppable = function(node) {
        var that = this;
        $(node).droppable({
            drop : function(event, ui) {
                var source = ui.draggable.parent().attr('_pos');
                var target = $(this).attr('_pos');

                if(!_.include(that.board.valid_moves[source], target)) {
                    return false;
                }

                if(source != target) {
                    var img = ui.draggable.remove();
                    that._setImage(target, img.attr('_type'));
                }

                this.selected = null;
                $(that).trigger('onMove', [source, target]);
            }
        });
    };

    FooBoard.prototype._createTd = function(file, rank) {
        var td = this._c('td');
        if(file == 'x' || rank == 'x') {
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
        var current = this.pieces[pos];
        if (current && current.getAttribute('_type') == piece) {
            return;
        } else if (current && current.getAttribute('_type') != piece) {
            $(this.squares[pos]).find('img').remove();
        }
        
        var td = this.squares[pos];
        var type = this._imgMap[piece];
        
        var img = this._c('img');
        img.setAttribute('src', 'img/' + type + '.png');
        img.setAttribute('_type', piece);
        td.appendChild(img);
        
        this.pieces[pos] = img;
        
        $(td).find('img').draggable({
            revert : true
        });
    };

    FooBoard.prototype._attachEvents = function() {
        $(this.table).bind('click', _.bind(function(evt) {
            var square = (evt.target.tagName == 'IMG' ? evt.target.parentNode : evt.target).getAttribute('_pos');
            if (this.board.valid_moves[square]) {
                if (this.selected) {
                    $(this.selected).css('background', '');
                }
                if (this.selected != evt.target) {
                    $(evt.target).css('background', 'orange');
                    this.selected = evt.target;
                } else {
                    this.selected = null;
                }
            } else if (this.selected) {
                var from = this.selected.parentNode.getAttribute('_pos');
                if(_.include(this.board.valid_moves[from], square)) {
                    this.selected = null;
                    $(this).trigger('onMove', [from, square]);
                }
            }
        }, this));
    };
    
    FooBoard.prototype._c = function(tagName) {
        return document.createElement(tagName);
    };

    FooBoard.prototype._imgMap = {
        r : 'br',
        n : 'bn',
        b : 'bb',
        q : 'bq',
        k : 'bk',
        p : 'bp',
        R : 'wr',
        N : 'wn',
        B : 'wb',
        Q : 'wq',
        K : 'wk',
        P : 'wp'
    };

    return FooBoard;
});
