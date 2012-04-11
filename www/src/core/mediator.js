define(['backbone'], function(Backbone) {
	
	var Mediator = function() {
	};

	_.extend(Mediator.prototype, Backbone.Events);

	Mediator.prototype.start = function() {
		this.trigger('start');
	};

	return Mediator;
	
});