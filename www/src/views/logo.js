define(['backbone'], function(Backbone) {

	return Backbone.View.extend({

		el: $('#logo'),

		initialize: function() {
			this.options.mediator.on('start', this.render, this);
		},

		render: function() {
			this.el.innerHTML = 'kingside';
		}

	});

});