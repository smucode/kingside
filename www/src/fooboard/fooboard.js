define(['underscore', '../../../src/event/pubsub'], function(_, pubsub) {

    var FooBoard = function(target) {
        this.board = {};
        this.pieces = {};
        this.squares = {};
        this.selected = null;
        
        this.target = target;
    };
    
    // public

    FooBoard.prototype.render = function(opts) {
        this.files = 'abcdefgh'.split('');
        this.ranks = '87654321'.split('');

        if (opts.orientation == 'b') {
            this.files.reverse();
            this.ranks.reverse();
        }

        this._create();
    };

    FooBoard.prototype.update = function(obj) {
        if (this.board.from) {
            this._removeClass(this.squares[this.board.from], 'hl');
        }
        
        if (this.board.to) {
            this._removeClass(this.squares[this.board.to], 'hl');
        }
        
        _.each(this.pieces, function(p, pos) {
            if (obj.board[pos]) {
                this._updatePiece(pos, obj.board[pos]);
            } else {
                p.className = '';
            }
        }, this);
        
        if (obj.from) {
            this.squares[obj.from].className += ' hl';
        }
        
        if (obj.to) {
            this.squares[obj.to].className += ' hl';
        }
        
        this.board = obj;
    };
    
    FooBoard.prototype._removeClass = function(node, name) {
        var pos = node.className.indexOf(name);
        if (pos >= 0) {
            node.className = node.className.slice(0, pos);
        }
    };
    
    FooBoard.prototype.destroy = function(fn) {
        $(this.target).remove();
    };
    
    // private

    FooBoard.prototype._create = function() {
        this.table = this._c('div');
        this.table.className = 'fooboard';
        _.each(this.ranks, function(rank) {
            var tr = this._c('div');
            tr.className = 'rank';
            _.each(this.files, function(file) {
                var sq = this._createSquare(file, rank);
                var p = this._createPiece(file, rank);
                this._makeDroppable(p);
                sq.appendChild(p);
                tr.appendChild(sq);
            }, this);
            this.table.appendChild(tr);
        }, this);
        this._attachEvents();
        this.target.appendChild(this.table);
    };

    FooBoard.prototype._createSquare = function(file, rank) {
        var td = this._c('div');
        if(file == 'x' || rank == 'x') {
            td.className = 'legend';
            td.innerHTML = (file != 'x' ? file : (rank != 'x' ? rank : '')).toUpperCase();
        } else {
            td.setAttribute('_pos', file + rank);
            td.className = this._getClassName(file, rank) + ' square';
            this.squares[file + rank] = td;
        }
        return td;
    };
    
    FooBoard.prototype._createPiece = function(file, rank) {
        var td = this._c('div');
        td.setAttribute('_pos', file + rank);
        this.pieces[file + rank] = td;
        return td;
    };

    FooBoard.prototype._makeDroppable = function(node) {
        var that = this;

        $(node).draggable({
            delay: 100,
            revert : true,
            containment: $('body')
        });
        
        $(node).droppable({
            drop : function(event, ui) {
                var target = $(this).attr('_pos');
                var source = ui.draggable.attr('_pos');
                if(_.include(that.board.valid_moves[source], target)) {
                    that._fireEvent(source, target);
                }
            }
        });
    };

    FooBoard.prototype._fireEvent = function(from, to) {
        this.selected = null;
        pubsub.pub('/fooboard/move', {
            from: from,
            to: to
        });
    };
    
    FooBoard.prototype._getClassName = function(file, rank) {
        var fileIdx = (_.indexOf(this.files, file) % 2);
        return fileIdx - (rank % 2) ? 'light' : 'dark';
    };

    FooBoard.prototype._updatePiece = function(pos, type) {
        var p = this.pieces[pos];
        p.className = 'piece ' + this._classMap[type];
        p.setAttribute('_type', type);
    };

    FooBoard.prototype._attachEvents = function() {
        $(this.table).bind('click', _.bind(function(evt) {
            var sq = evt.target.parentNode;
            var pos = evt.target.getAttribute('_pos');
            
            if (this.board.valid_moves[pos]) {
                if (this.selected) {
                    $(this.selected).css('background', '');
                }
                if (this.selected != sq) {
                    $(sq).css('background', 'orange');
                    this.selected = sq;
                } else {
                    this.selected = null;
                }
            } else if (this.selected) {
                var from = this.selected.getAttribute('_pos');
                if(_.include(this.board.valid_moves[from], pos)) {
                    $(this.selected).css('background', '');
                    this._fireEvent(from, pos);
                }
            }
        }, this));
    };
    
    FooBoard.prototype._c = function(tagName) {
        return document.createElement(tagName);
    };

    FooBoard.prototype._classMap = {
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
