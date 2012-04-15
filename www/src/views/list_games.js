define(['underscore'], function(_) {
    
    return Backbone.View.extend({

        el: $('#list-games'),

        initialize: function() {
            this.options.mediator.on('start', _.bind(function() {
                $.get('src/views/list_games.html', _.bind(function(html) {
                    this._html = html;
                    this.render();
                }, this));
            }, this));

            this.options.gameController.on('new', _.bind(function() {
                this.render();
            }, this));

            this.$el.bind('click', _.bind(function(e) {
                var id = e.target.getAttribute('game-id');
                if (id) {
                    this.options.gameController.activateGame(id);
                }
            }, this));

        },

        render: function(games) {
            if (this._html) {
                var games = this.options.gameController.listGames();
                this.$el.html(_.template(this._html, {games: games}));
            }
        }

    });

});