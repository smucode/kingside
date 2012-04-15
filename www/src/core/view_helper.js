define(['views/logo', 'views/fooboard', 'views/current_game', 'views/new_game', 'views/list_games'], function() {
	var args = arguments;
	return {
		getViews: function() {
			return args;
		}
	}
});
