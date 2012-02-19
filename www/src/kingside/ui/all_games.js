define(['underscore', '../../../../src/event/pubsub', '../service/gameService', '../auth'], function(_, pubsub, gameService, auth) {
    
    var Widget = function() {
        this._target = $('#all-games');

        $.get('src/kingside/ui/all_games.html', _.bind(function(html) {
            this._html = html;
            this._render();
        }, this));

        gameService.list(_.bind(this._updateGames, this));
        gameService.onUpdate(_.bind(this._updateGames, this));
    };

    Widget.prototype._updateGames = function(games) {
        var _games = {mine: [], their: []};
        _.each(games, function(game) {
            if (auth.isMe(game[game.state.active_color]) || game[game.state.active_color] == 'local') {
                _games.mine.push(game);
            } else {
                _games.their.push(game);
            }
        });
        this._games = _games;
        this._render();
    };

    Widget.prototype._render = function() {
        if (this._games && this._html) {
            this._target.html(_.template(this._html, this._games));
        }
    };

    Widget.prototype.onClick = function(fn) {
        this._target.bind('click', _.bind(function(e) {
            var id = $(e.target).attr('id');
            var game = gameService.get(id);
            fn(game);
        }, this));
    };

    return Widget;

});