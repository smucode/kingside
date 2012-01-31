define(['underscore', './timer'], function(_, Timer) {
    var Panel = function(link, target, data) {
        this._data = data;
        this._link = link;
        this._target = target;
        
        this._panel = this._createPanel();
        this._target.append(this._panel);
        
        // attach events
        
        this._timer = new Timer(500);
        
        this._link.on('click', _.bind(this._showPanel, this));
        this._link.on('mouseover', _.bind(this._showPanel, this));
        
        this._link.on('mouseout', _.bind(this._hidePanel, this));
        this._panel.on('mouseout', _.bind(this._hidePanel, this));
        
        this._panel.on('mouseover', _.bind(this._timer.cancel, this._timer));
    };
    
    Panel.prototype._showPanel = function() {
        if (Panel._active && Panel._active != this._panel) {
            Panel._active.hide();
        }
        Panel._active = this._panel;
        
        this._timer.cancel();
        this._panel.css('left', this._link.offset().left);
        this._panel.slideDown();
    };
    
    Panel.prototype._hidePanel = function() {
        this._timer.delay(_.bind(this._panel.hide, this._panel));
    };
    
    Panel.prototype._createPanel = function() {
        var panel = $('<div></div>')
            .addClass('panel');
        
        _.each(this._data, function(v, k) {
            var that = this;
            var link = $('<a href="#" id="' + k + '">' + k + '</a>').click(function() {
                var id = $(this).attr('id');
                that.listener.apply(that.listener, that._data[id]);
                panel.hide();
            });
            panel.append(link);
        }, this);
        
        return panel;
    };
    
    Panel.prototype.onClick = function(fn) {
        this.listener = fn;
    };
    
    return Panel;
});
