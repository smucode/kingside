define(['underscore', './timer', './panel', './auth', './socket'], function(_, Timer, Panel, auth, socket) {
    var Games = function() {
        this._target = $('.games');
        
        this._link = this._createLink();
        
        this._target.append(this._link);
        this._target.append(this._panel);
        
        this._links = {'Please log in to see your active games': {}};
        this._panel = new Panel(this._link, this._target, this._links);
        
        $.getJSON('/games', _.bind(function(games) {
            var map = {};
            _.each(games, function(game, i) {
                var id = (i + 1) + ': ' + this._getGameDesc(game);
                map[id] = game;
            }, this);
            this._panel.renderLinks(map);
        }, this));
    };
    
    Games.prototype._getGameDesc = function(game) {
        var me = auth.user.email;
        return 'Playing as ' + (me == game.w ? ' white ' : ' black ') + ' against ' + (me == game.w ? game.b : game.w);
    };
    
    Games.prototype._createLink = function() {
        return $('<a></a>')
            .attr('href', '#')
            .html('Active Games');
    };
    
    Games.prototype.onClick = function(fn) {
        this._panel.onClick(fn);
    };
    
    return Games;
});
