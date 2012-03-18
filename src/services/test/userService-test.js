var _ = require('underscore');
var vows = require('vows');
var buster = require("buster");
var service = require('../userService').UserService;

service.setDao({
    save: function() {},
    find: function() {}
});

buster.assertions.add("containsTheSame", {
    assert: function(arr1, arr2) {
        if(arr1.length != arr2.length) {
            return false;
        }
        _.each(arr1, function(elem) {
            if(!_.include(arr2, elem)) {
                return false;
            }
        });
        return true;
    },
    assertMessage: "Expected ${1} to contains the same objecs as ${2}",
    refuteMessage: "Expected ${1} not to contains the same objecs as ${2}"
});

buster.testCase('create or update user', {
    'if user does not exist save it' : function() {
        var daoCalled, lookingForUser;
        service.setDao({
            save: function(user) {
                daoCalled = true;
            },
            find: function(user, cb) {
                lookingForUser = user;
                cb(null,[]);
            }
        });
        var testUser = {firstname: 'firstname', lastname: 'lastname', email: 'user email'};
        service.create(testUser);
        assert.equals(testUser.email, lookingForUser.email);
        assert(daoCalled);
    },
    'if user does exist update it' : function() {
        var saveCalled = false, updateCalled = false, lookingForUser;
        service.setDao({
            save: function(user) {
                saveCalled = true;
            },
            update: function(user) {
                updateCalled = true;
            },
            find: function(user, cb) {
                lookingForUser = user;
                cb(null,[{}]);
            }
        });
        var testUser = {firstname: 'firstname', lastname: 'lastname', email: 'user email'};
        service.create(testUser);
        refute(saveCalled);
        assert(updateCalled);
    },
    'true if if user exists': function() {
        service.setDao({
            find: function(user, cb) {
                cb(null, [{name: 'myUser'}]);
            }  
        });
        service.doesUserExists('testur@testur.com', function(exists) {
            assert(exists);
        });
    },
    'false if user does not exists': function() {
        service.setDao({
            find: function(user, cb) {
                cb(null, []);
            }  
        });
        service.doesUserExists('testur@testur.com', function(exists) {
            refute(exists);
        });
    }
});