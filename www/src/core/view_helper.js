define(['views/logo', 'views/fooboard', 'views/current_game', 'views/new_game'], function() {
	var args = arguments;
	return {
		getViews: function() {
			return args;
		}
	}
});
