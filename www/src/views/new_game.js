define(['underscore', 'backbone'], function(_, Backbone) {
    
    return Backbone.View.extend({

        el: $('#new-game'),

        initialize: function() {
            this.options.mediator.on('start', _.bind(function() {
                $.get('src/views/new_game.html', _.bind(function(html) {
                    this._html = html;
                    this.render();
                }, this));                
            }, this));
        },

        render: function() {
            this.$el.html(_.template(this._html, {}));
            this.$el.find('a').bind('click', _.bind(function(e) {
                switch (e.target.className) {
                    case 'white': this._newGame('local', 'garbo'); break;
                    case 'black': this._newGame('garbo', 'local'); break;
                    case 'online': this._newGame('local', 'remote'); break;
                    default: throw 'wtf';
                }
            }, this));
        },

        _newGame: function(w, b) {
            this.options.gameController.createGame(w, b);
        }

    });

});