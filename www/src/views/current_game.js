define(['underscore'], function(_) {
    
    return Backbone.View.extend({

        el: $('#current-game'),

        initialize: function() {
            this.options.mediator.on('start', this.render, this);

            $.get('src/views/current_game.html', _.bind(function(html) {
                this._html = html;
                this.render();
            }, this));

            this.options.gameController.on('new', this._update, this);
            this.options.gameController.on('update', this._update, this);
        },

        render: function() {
            if (this._html && this._current) {
                this.$el.html(_.template(this._html, {
                    game: this._current,
                    format: this._format
                }));
            }
        },

        _update: function(game) {
            this._current = game;
            console.log(game)
            this.render();
        },

        _format: function(name) {
            if (name == 'local') {
                return 'You';
            }
            if (name == 'garbo') {
                return 'The Computer';
            }
            return 'foo';
        }

    });

});