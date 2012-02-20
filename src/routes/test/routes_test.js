var buster = require("buster");
var dao = require('../../dao/userDaoMock').UserDaoMock;
var userService = require('../../services/userService').UserService;
var routes = require('../routes').routes;

buster.testCase('routes test', {
	setUp: function() {
		userService.setDao(dao);
		var buddy = {
			firstname: 'first',
			lastname: 'lastname',
			email: 'buddy@buddy.com'
		};
		userService.create(buddy);
	},
	'//add buddy through the api': function(){
		var add_buddy = routes.puts['/add_buddy/'];
		add_buddy({
			query: {id: 'buddy@buddy.com'},
			send: function(added) {
				assert(added);
			},
			headers: {cookie: 'estest'}
		});
	}
});