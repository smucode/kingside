define(['underscore', './timer', './panel', './auth', './socket'], function(_, Timer, Panel, auth, socket) {
    var Games = function() {
        this._target = $('.games');
        
        this._link = this._createLink();
        
        this._target.append(this._link);
        this._target.append(this._panel);
        
        this._links = {};
        if (!auth.getUser()) {
            this._links['Please log in to see your active games'] = {};
        } else {
            this._links['bla di bla'] = {};
        }
        
        this._panel = new Panel(this._link, this._target, this._links);
        
        socket.on('find_game', function() {
            console.log('xxx', arguments);
        });
    };
    
    Games.prototype._createLink = function() {
        return $('<a></a>')
            .attr('href', '#')
            .html('Active Games');
    };
    
    return Games;
});
