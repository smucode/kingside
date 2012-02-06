define(['underscore', '../../../src/event/pubsub'], function(_, pubsub) {

    var FooBoard = function(target) {
        this.board = {};
        this.pieces = {};
        this.squares = {};
        this.selected = null;
        this.target = target;
        
        this._fileRankMap = {
            w: {
                files: 'abcdefgh'.split(''),
                ranks: '87654321'.split('')
            },
            b: {
                files: 'abcdefgh'.split('').reverse(),
                ranks: '87654321'.split('').reverse()
            }
        };
        
        this.files = 'abcdefgh'.split('');
        this.ranks = '87654321'.split('');
        
        this.bfiles = 'hgfedcba'.split('');
        this.branks = '12345678'.split('');
        
        pubsub.sub('/game/updated', _.bind(this.update, this));
    };
    
    // public

    FooBoard.prototype.render = function(opts) {
        this._create();
    };

    FooBoard.prototype._idToPos = function(id) {
        var f = this._fileRankMap[this._orientation].files[id.charAt(1)];
        var r = this._fileRankMap[this._orientation].ranks[id.charAt(2)];
        return f + r;
    };
    
    FooBoard.prototype._posToId = function(pos) {
        var f = this._fileRankMap[this._orientation].files.indexOf(pos.charAt(0));
        var r = this._fileRankMap[this._orientation].ranks.indexOf(pos.charAt(1));
        return 'x' + f + r;
    };
    
    FooBoard.prototype._flip = function(pos) {
        var arr = pos.split('');
        var f = this.bfiles[this.files.indexOf(pos.charAt(0))];
        var r = this.branks[this.ranks.indexOf(pos.charAt(1))];
        return f + r;
    };

    FooBoard.prototype.update = function(obj, game) {
        this._resetBoard();
        
        this._orientation = (game.w.type == 'local') ? 'w' : 'b';
        
        _.each(this.pieces, function(p, id) {
            var pos = this._idToPos(id);
            if (obj.board[pos]) {
                this._updatePiece(id, obj.board[pos]);
            } else {
                p.className = '';
            }
        }, this);
        
        if (obj.from) {
            this.squares[this._posToId(obj.from)].className += ' hl';
        }
        
        if (obj.to) {
            this.squares[this._posToId(obj.to)].className += ' hl';
        }
        
        this.board = obj;
    };
    
    FooBoard.prototype._resetBoard = function() {
        if (this.board.from) {
            this._removeClass(this.squares[this._posToId(this.board.from)], 'hl');
        }
        if (this.board.to) {
            this._removeClass(this.squares[this._posToId(this.board.to)], 'hl');
        }
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
        _.each(_.range(8), function(rank_id) {
            var tr = this._c('div');
            tr.className = 'rank';
            _.each(_.range(8), function(file_id) {
                var sq = this._createSquare(file_id, rank_id);
                var p = this._createPiece(file_id, rank_id);
                this._makeDroppable(p);
                sq.appendChild(p);
                tr.appendChild(sq);
            }, this);
            this.table.appendChild(tr);
        }, this);
        this._attachEvents();
        this.target.appendChild(this.table);
    };

    FooBoard.prototype._createSquare = function(file_id, rank_id) {
        var td = this._c('div');
        td.setAttribute('_pos', 'x' + file_id + rank_id);
        td.className = this._getClassName(file_id, rank_id) + ' square';
        this.squares['x' + file_id + rank_id] = td;
        return td;
    };
    
    FooBoard.prototype._createPiece = function(file_id, rank_id) {
        var td = this._c('div');
        td.setAttribute('_pos', 'x' + file_id + rank_id);
        this.pieces['x' + file_id + rank_id] = td;
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
                var target_id = $(this).attr('_pos');
                var source_id = ui.draggable.attr('_pos');
                
                var target_pos = that._idToPos(target_id);
                var source_pos = that._idToPos(source_id);
                
                console.log(target_pos, target_id);
                
                if(_.include(that.board.valid_moves[source_pos], target_pos)) {
                    that._fireEvent(source_pos, target_pos);
                }
            }
        });
    };

    FooBoard.prototype._fireEvent = function(from, to) {
        this.selected = null;
        pubsub.pub('/fooboard/move', {
            to: to,
            from: from,
            gameId: this.board.gameId
        });
    };
    
    FooBoard.prototype._getClassName = function(file_id, rank_id) {
        return (file_id % 2) - (rank_id % 2) ? 'dark' : 'light';
    };

    FooBoard.prototype._updatePiece = function(id, type) {
        var piece = this.pieces[id];
        piece.className = 'piece ' + this._classMap[type];
        piece.setAttribute('_type', type);
    };

    FooBoard.prototype._attachEvents = function() {
        var that = this;
        $(this.table).bind('click', _.bind(function(evt) {
            var sq = evt.target.parentNode;
            
            var id = evt.target.getAttribute('_pos');
            var pos = that._idToPos(id);
            
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
                
                var from_id = this.selected.getAttribute('_pos');
                var from = that._idToPos(from_id);
                
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
