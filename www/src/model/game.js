define(['underscore', 'backbone', '../../../src/rex/rex', '../../../src/garbo/garbo'], function(_, Backbone, Rex, Garbo) {

    return Backbone.Model.extend({
        defaults: {
            state: {}
        },

        initialize: function(options) { // rex, white, black
            this._options = options;

            this._initRex();
            this._initPlayers();
        },

        _initRex: function() {
            this._rex = new Rex();
            
            this._rex.onMove(_.bind(function(state) {
                this.set('state', state);

                if (this._b) this._b.update(state);
                if (this._w) this._w.update(state);
            }, this));
        },

        _initPlayers: function() {
            this.b = this._options.b;
            this.w = this._options.w;

            if (this._options.b == 'garbo') {
                this._b = new Garbo('b');
                this._b.onMove(_.bind(this.move, this));
            }
            if (this._options.w == 'garbo') {
                this._w = new Garbo('w');
                this._w.onMove(_.bind(this.move, this));
            }
        },

        move: function(from, to) {
            console.log('game move', arguments);
            this._rex.move(from, to);
            this.trigger('move', this.get('id'), from, to);
        }

    });

});
