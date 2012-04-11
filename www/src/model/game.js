define(['underscore', 'backbone', '../../../src/rex/rex'], function(_, Backbone, Rex) {

	return Backbone.Model.extend({
 		defaults: {
 			id: Math.random().toString(16).substr(2),
 			state: {}
	    },

	    initialize: function() {

	    	// todo: inject?
	    	this._rex = new Rex();
	        this._rex.onMove(_.bind(function(state) {
            	this.set('state', state);
            }, this));

	    },

	    move: function(from, to) {
	    	this._rex.move(from, to);
	    }

	});

});
