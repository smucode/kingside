define(
	[
		'underscore', 
		'core/mediator', 
		'core/view_helper', 
		'core/game_controller', 
		'core/auth'
	], 
	function(_, Mediator, ViewHelper, GameController, Auth) {
		return function() {

			var auth = new Auth();
			var mediator = new Mediator();
			var gameController = new GameController(mediator);

			var opts = {
				auth: auth,
				mediator: mediator,
				gameController: gameController
			};

			_.each(ViewHelper.getViews(), function(View) {
				new View(opts);
			});

			auth.getUser(_.bind(mediator.start, mediator));
		}
	}
);