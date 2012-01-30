define(['underscore', './timer'], function(_, Timer) {
    var Menu = function() {
        this._links = {
            'Play against Computer': ['local', 'garbo'],
            'Play Online': ['local', 'remote'],
            'cpu/user': ['garbo', 'local'],
            'user/user': ['local', 'local'],
            'cpu/cpu': ['garbo', 'garbo']
        };

        // create the dom
        
        this._target = $('.menu');
        this._link = this._createLink();
        this._panel = this._createPanel();
        
        this._target.append(this._link);
        this._target.append(this._panel);
        
        // attach events
        
        this._timer = new Timer(500);
        
        this._link.on('click', _.bind(this._showPanel, this));
        this._link.on('mouseover', _.bind(this._showPanel, this));
        
        this._link.on('mouseout', _.bind(this._hidePanel, this));
        this._panel.on('mouseout', _.bind(this._hidePanel, this));
        
        this._panel.on('mouseover', _.bind(this._timer.cancel, this._timer));
    };
    
    Menu.prototype._showPanel = function() {
        this._timer.cancel();
        this._panel.css('left', this._link.offset().left);
        this._panel.slideDown();
    };
    
    Menu.prototype._hidePanel = function() {
        console.log(this);
        this._timer.delay(_.bind(this._panel.slideUp, this._panel));
    };
    
    Menu.prototype._createLink = function() {
        return $('<a></a>')
            .attr('href', '#')
            .html('New Game');
    };
    
    Menu.prototype._createPanel = function() {
        var panel = $('<div></div>')
            .addClass('panel');
        
        _.each(this._links, function(v, k) {
            var that = this;
            var link = $('<a href="#" id="' + k + '">' + k + '</a>').click(function() {
                var id = $(this).attr('id');
                that.listener.apply(that.listener, that._links[id]);
                panel.hide();
            });
            panel.append(link);
        }, this);
        
        return panel;
    };
    
    Menu.prototype.onStart = function(fn) {
        this.listener = fn;
    };
    
    return Menu;
});
