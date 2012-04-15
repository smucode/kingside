define(
	[
		'views/logo', 
		'views/login',
		'views/status',
		'views/fooboard', 
		'views/new_game', 
		'views/list_games',
		'views/current_game'
	],
	function() {
		var args = arguments;
		return {
			getViews: function() {
				return args;
			}
		}
	}
);
