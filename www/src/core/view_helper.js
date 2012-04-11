define(['views/logo', 'views/fooboard'], function(Logo, FooBoard) {
	var args = arguments;
	return {
		getViews: function() {
			return args;
		}
	}
});
