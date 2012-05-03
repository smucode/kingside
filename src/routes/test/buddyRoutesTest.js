var _ = require('underscore');
var buster = require('buster');
var assert = buster.assertions.assert;
var conf = require('../../conf/conf');

var route = require('../buddyRoutes').BuddyRoutes;

buster.testCase('buddy routes test gets get called', {
    setUp: function() {
        conf.dev = true;
        route.setCache({
            get: function() {
                return {name: 'testUser', email: 'test@email.com'};
            }
        });
        this.testService = {
            getBuddyList: function(email, cb) {
                cb(['buddyOne', 'buddyTwo']);
            },
            addBuddy: function(id, buddyId, cb) {
                cb(true);
            },
            removeBuddy: function(id, buddyId, cb) {
                cb(true);
            }
        };
        route.setBuddyService(this.testService);

        this.testRes = {
            contentType: function(type) {
                assert.equals('json', type);
            }
        };    

    },
    'get returns buddy list': function(done) {
        route.get({}, _.extend(this.testRes, {
            send: function(game) {
                assert.equals('["buddyOne","buddyTwo"]', game);
                done();
            }
        }), {});
    },
    'get empty object on empty ': function(done) {
        route.setBuddyService({
            getBuddyList: function(email, cb) {
                cb({});
            }
        });
        route.get({}, _.extend(this.testRes, {
            send: function(game) {
                assert.equals("{}", game);
                done();
            }
        }), {});
    },
    'PUT on buddy list sends out respones of successfull add': function(done) {
        route.put({query: {id: 'testur'}}, _.extend(this.testRes, {
            send: function(game, status) {
                assert(game);
                assert.equals(201, status);
                done();
            }
        }), {});
    },
    'PUT on buddy list sends out error response on unsucessful add': function(done) {
        route.setBuddyService(_.extend(this.testService, {
            addBuddy: function(id, buddyId, cb) {
                cb(false);
            }
        }));
        route.put({query: {id: 'testur'}}, _.extend(this.testRes, {
            send: function(game, status) {
                refute(game);
                assert.equals(404, status);
                done();
            }
        }), {});
    },
    'DEL on buddy list sends out respones of successfull remove': function(done) {
        route.del({query: {id: 'testur'}}, _.extend(this.testRes, {
            send: function(game, status) {
                assert(game);
                assert.equals(201, status);
                done();
            }
        }), {});
    },
    'DEL on buddy list sends out error response on unsucessful remove': function(done) {
        route.setBuddyService(_.extend(this.testService, {
            removeBuddy: function(id, buddyId, cb) {
                cb(false);
            }
        }));
        route.del({query: {id: 'testur'}}, _.extend(this.testRes, {
            send: function(game, status) {
                refute(game);
                assert.equals(404, status);
                done();
            }
        }), {});
    }
});