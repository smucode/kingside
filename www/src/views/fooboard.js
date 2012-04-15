define(['underscore', 'backbone'], function(_, backbone) {
  
    return Backbone.View.extend({

        el: $('#board'),

        initialize: function(opts) {
            this.render();

            this.options.gameController.on('new', this.update, this);
            this.options.gameController.on('update', this.update, this);
        },

        render: function() {
            this.board = {};
            this.pieces = {};
            this.squares = {};
            this.selected = null;
            
            this._lastMove = [null, null];
            
            var alph = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
            var nums = ['8', '7', '6', '5', '4', '3', '2', '1'];

            var alphr = _.clone(alph).reverse();
            var numsr = _.clone(nums).reverse();

            this._fileRankMap = {
                w: { files: alph, ranks: nums },
                b: { files: alphr, ranks: numsr }
            };

            this._create();
        },

        // update

        update: function(game) {
            this._resetBoard();

            var state = game.get('state');
            
            this._gameId = game.gameId;

            this._orientation = (game.w == 'local' || this.options.auth.isMe(game.w)) ? 'w' : 'b';

            _.each(this.pieces, function(p, id) {
                var pos = this._idToPos(id);
                if (state.board[pos]) {
                    this._updatePiece(id, state.board[pos]);
                } else {
                    p.className = '';
                }
            }, this);
            
            this._highlightLastMove(state, game);
            
            this.board = state;
            this.game = game;
        },

        _resetBoard: function() {
            if (this._lastMove) {
                if (this._lastMove[0]) {
                    this._removeClass(this.squares[this._posToId(this._lastMove[0])], 'hl');
                }
                if (this._lastMove[1]) {
                    this._removeClass(this.squares[this._posToId(this._lastMove[1])], 'hl');
                }
            }
        },

        _highlightLastMove: function(obj, game) {
            var fromGame = (game.moves && game.moves.length) ? game.moves[game.moves.length - 1] : [null, null];
            
            var from = obj.from || fromGame[0];
            if (from) {
                this.squares[this._posToId(from)].className += ' hl';
            }
            
            var to = obj.to || fromGame[1];
            if (to) {
                this.squares[this._posToId(to)].className += ' hl';
            }
            
            this._lastMove = [from, to];
        },

        _updatePiece: function(id, type) {
            var piece = this.pieces[id];
            piece.className = 'piece ' + this._classMap[type];
            piece.setAttribute('_type', type);
        },

        // create

        _create: function() {
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
            this.el.appendChild(this.table);
        },

        _createSquare: function(file_id, rank_id) {
            var td = this._c('div');
            var id = this._createId(file_id, rank_id);
            td.className = this._getClassName(file_id, rank_id) + ' square';
            td.setAttribute('_pos', id);
            this.squares[id] = td;
            return td;
        },

        _createPiece: function(file_id, rank_id) {
            var td = this._c('div');
            var id = this._createId(file_id, rank_id);
            td.setAttribute('_pos', id);
            this.pieces[id] = td;
            return td;
        },

        _attachEvents: function() {
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
        },

        _makeDroppable: function(node) {
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
        },

        // utils

        _removeClass: function(node, name) {
            var pos = node.className.indexOf(name);
            if (pos >= 0) {
                node.className = node.className.slice(0, pos);
            }
        },

        _idToPos: function(id) {
            var f = this._fileRankMap[this._orientation].files[id.charAt(1)];
            var r = this._fileRankMap[this._orientation].ranks[id.charAt(2)];
            return f + r;
        },

        _posToId: function(pos) {
            var f = this._fileRankMap[this._orientation].files.indexOf(pos.charAt(0));
            var r = this._fileRankMap[this._orientation].ranks.indexOf(pos.charAt(1));
            return this._createId(f, r);
        },

        _c: function(tagName) {
            return document.createElement(tagName);
        },

        _createId: function(f, r) {
            return 'x' + f + r;
        },

        _getClassName: function(file_id, rank_id) {
            return (file_id % 2) - (rank_id % 2) ? 'dark' : 'light';
        },

        _classMap: {
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
        },

        // event stuff, change?

        _fireEvent: function(from, to) {
            this.selected = null; // todo, what is this?
            
            this.game.move(from, to);
        }

    });

});
