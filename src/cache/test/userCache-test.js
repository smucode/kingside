var _ = require('underscore');
var buster = require('buster');
var cache = require('../userCache').UserCache;
var assert = buster.assertions.assert;

buster.testCase('add and get user based on sid', {
    setUp: function() {
        this.testUser = {name: 'testur', email: 'testur@testur.testur'};
        cache.add('sid', this.testUser);
    },
    tearDown: function() {
        cache.clearCache();
    },
    'add user to sid' : function() {
        assert(cache.get('sid'), this.testUser);
    },
    'throws an exception if already exist': function() {
        assert.exception(function() {
            cache.add('sid', this.testUser);
        });
    },
    'uses sid in request when available': function() {
        var called = false;
        cache.setUtil({
            getSid: function(input) {
                called = true;
                return input;
            }
        });
        var user = cache.get({headers: {cookie: 'sid'}});
        assert.equals(user, this.testUser);
    }
});