define(['underscore', '../service/buddy_service'], function(_, bs) {
    
    var Widget = function() {
        this.listener = null;
        $.get('src/kingside/ui/new_game.html', _.bind(function(html) {
            this._html = $(html);
            this._initNewGame();
            this._initComputer();
            this._initOnline();
        }, this));
    };

    Widget.prototype._initComputer = function() {
        this._html.find('#play-computer').click(_.bind(function() {
            this.opponent.hide();
            this.computer.show();
        }, this));
    };

    Widget.prototype._initOnline = function() {
        this._html.find('#play-online').click(_.bind(function() {
            this.opponent.hide();
            this.online.show();
            bs.list();
        }, this));
    };

    Widget.prototype._initNewGame = function() {
        $('#new-game').click(_.bind(function() {
            this.opponent = this._html.find('#select-opponent');
            this.computer = this._html.find('#selected-computer');
            this.online = this._html.find('#selected-online');

            this._attachEvents();

            this.opponent.show();
            this.computer.hide();
            this.online.hide();

            this._html.modal();
        }, this));
    };

    Widget.prototype._attachEvents = function() {
        this._html.find('#computer-white').click(_.bind(function(){
            this.listener('local', 'garbo');
            this._hide();
        }, this));
        
        this._html.find('#computer-black').click(_.bind(function(){
            this.listener('garbo', 'local');
            this._hide();
        }, this));
        
        this._html.find('#online-random').click(_.bind(function(){
            this.listener('local', 'remote');
            this._hide();
        }, this));
    };

    Widget.prototype._hide = function() {
        this.opponent.hide();
        this.computer.hide();
        this._html.modal('hide');
    };

    Widget.prototype.onSelect = function(fn) {
        this.listener = fn;
    };

    return Widget;

});