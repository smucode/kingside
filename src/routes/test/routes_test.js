var _ = require('underscore');
var buster = require('buster');
var assert = buster.assertions.assert;

var userDao = require('../../dao/userDaoMock').UserDaoMock;
var userService = require('../../services/userService').UserService;
var gameService = require('../../services/gameService').GameService;
var buddyService = require('../../services/buddyService').BuddyService;
var routes = require('../routes').Routes;

buster.assertions.add("containsResources", {
    assert: function(get, resources) {
        var status = true;
         _.each(resources, function(resource) {
            if(!get[resource]) {
               status = false;
            }
        });
        _.each(resources, function(resource) {
            delete get[resource];
        });
        if (get === {}) {
            status = false;
        }
        return status;
    },
    assertMessage: "Expected ${1} to contain resource${2}",
    refuteMessage: "Expected ${1} not to contain resource ${2}"
});

buster.testCase('routes test', {
    setUp: function() {
    },
    'get contains correct resources': function() {
        var get = routes.get();
        var resources = ['/user', '/buddies', '/games', '/request_game/'];
        assert.containsResources(get, resources);
    },
    'puts contains correct resources': function() {
        var put = routes.put();
        var resources = ['/buddies'];
        assert.containsResources(put, resources);
    },
    'del contains correct resources': function() {
        var del = routes.del();
        var resources = ['/buddies'];
        assert.containsResources(del, resources);
    }
});