var _ = require('underscore');
var buster = require('buster');
var cache = require('../userCache').UserCache;
var assert = buster.assertions.assert;

buster.testCase('add and get user based on sid', {
    setUp: function() {
        this.testUser = {name: 'testur', email: 'testur@testur.testur'};
    },
    tearDown: function() {
        cache.clearCache();
    },
    'add user to sid' : function() {
        cache.add('sid', this.testUser);
        assert(cache.get('sid'), this.testUser);
    },
    'throws an exception if already exist': function() {
        cache.add('sid', this.testUser);
        assert.exception(function() {
            cache.add('sid', this.testUser);
        });
    }
});