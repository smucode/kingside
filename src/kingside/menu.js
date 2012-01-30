define(['underscore', './timer', './panel'], function(_, Timer, Panel) {
    var Menu = function() {
        this._links = {
            'Play against Computer': ['local', 'garbo'],
            'Play Online': ['local', 'remote'],
            'cpu/user': ['garbo', 'local'],
            'user/user': ['local', 'local'],
            'cpu/cpu': ['garbo', 'garbo']
        };

        this._target = $('.menu');
        this._link = this._createLink();
        this._target.append(this._link);
        
        this._panel = new Panel(this._link, this._target, this._links);
    };
    
    Menu.prototype._createLink = function() {
        return $('<a></a>')
            .attr('href', '#')
            .html('New Game');
    };
    
    Menu.prototype.onStart = function(fn) {
        this._panel.onClick(fn);
    };
    
    return Menu;
});
