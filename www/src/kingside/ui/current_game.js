define(['underscore', '../../../../src/event/pubsub'], function(_, pubsub) {
    
    var Widget = function() {
        this._target = $('#current-game');

        $.get('src/kingside/ui/current_game.html', _.bind(function(html) {
            this._html = html;
            this._render();
        }, this));

        pubsub.sub('/game/updated', _.bind(function(game) {
            this._current = game;
            this._render();
        }, this));
    };

    Widget.prototype._render = function() {
        if (this._html && this._current) {
            this._target.html(_.template(this._html, {
                game: this._current,
                format: this._format
            }));
        }
    };

    Widget.prototype._format = function(name) {
        if (name == 'local') {
            return 'You';
        }
        if (name == 'garbo') {
            return 'The Computer';
        }
        return name;
    };

    return Widget;

});