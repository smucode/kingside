define(['underscore', '../../../../src/event/pubsub', '../game/game_helper'], function(_, pubsub, gameHelper) {
    
    var Widget = function() {
        this._target = $('#game-controls');

        $.get('src/kingside/ui/game_controls.html', _.bind(function(html) {
            this._html = html;
            this._target.html(this._html).hide();

            this._resign = this._target.find('#resign-button')
                .click(_.bind(this._resignClicked, this))
                .mouseout(function() { $(this).removeClass('btn-danger'); })
                .mouseover(function() { $(this).addClass('btn-danger'); });

            this._rematch = this._target.find('#rematch-button')
                .click(_.bind(this._rematchClicked, this));

            this._render();
        }, this));

        pubsub.sub('/game/updated', _.bind(function(game) {
            this._game = game;
            this._render();
        }, this));
    };

    Widget.prototype._resignClicked = function() {
        console.log('resign')
    };

    Widget.prototype._rematchClicked = function() {
        console.log('rematch')
    };

    Widget.prototype._render = function() {
        if (this._game && this._html) {
            this._target.show();
            if (this._game.state.finished) {
                this._resign.hide();
                this._rematch.show();
            } else {
                this._resign.show();
                this._rematch.hide();
            }
        }
    };

    return Widget;

});