var _ = require('underscore');
var buster = require('buster');
var assert = buster.assertions.assert;

var route = require('../userRoutes').UserRoutes;

buster.testCase('user routes test gets get called', {
    setUp: function() {
        route.setCache({
            get: function() {
                return {name: 'testUser'};
            }
        });
    },
    'get contains correct resources': function(done) {
        route.get({}, {
            contentType: function(type) {
                assert.equals('json', type);
            },
            send: function(user) {
                assert.equals('{"name":"testUser"}', user);
                done();
            }
        }, {});
    }
});