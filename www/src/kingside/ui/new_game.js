define(['underscore'], function(_) {
    
    var Widget = function() {
        $('#new-game').click(_.bind(function() {
            console.log('new game');
            
            this._html.find('#select-opponent').show();
            this._html.find('#selected-computer').hide();

            this._html.modal();
            this._initialize();
        }, this));

        $.get('src/kingside/ui/new_game.html', _.bind(function(html) {
            this._html = $(html);
        }, this));
    };

    Widget.prototype._initialize = function() {
        this._html.find('#play-computer').click(_.bind(function() {
            this._html.find('#select-opponent').hide();
            this._html.find('#selected-computer').show();
        }, this))
    };

    return Widget;

});