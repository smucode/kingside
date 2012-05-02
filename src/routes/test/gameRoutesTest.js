var _ = require('underscore');
var buster = require('buster');
var assert = buster.assertions.assert;
var conf = require('../../conf/conf');

var route = require('../gameRoutes').GameRoutes;

buster.testCase('game routes test gets get called', {
    setUp: function() {
        conf.dev = true;
        route.setCache({
            get: function() {
                return {name: 'testUser', email: 'test@email.com'};
            }
        });
        route.setGameService({
            findUserGames: function(email, cb) {
                cb({game: 'testGame'});
            }
        });
    },
    'get contains correct resources': function(done) {
        route.get({}, {
            contentType: function(type) {
                assert.equals('json', type);
            },
            send: function(game) {
                assert.equals('{"game":"testGame"}', game);
                done();
            }
        }, {});
    },
    'sends out errer on error': function(done) {
        route.setGameService({
            findUserGames: function(email, cb) {
                throw new Error();
            }
        });
        route.get({}, {
            contentType: function(type) {
                assert.equals('json', type);
            },
            send: function(error) {
                assert.equals(new Error(), error);
                done();
            }
        }, {});
    }
});