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
    }
});

buster.testCase('buddy list', {
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
    },
    "lookup users buddy list": function() {
        var friends = ['testur_friend@testur.com', 'testur_frind2@testur.com'];
        service.setDao({
            find: function(user, cb) {
                cb(null, [{
                    email: 'testur@testur.com',
                    buddies: friends
                }]);
            }
        });
        service.getBuddyList('testur@testur.com', function(buddies) {
            assert.equals(buddies, friends);
        });
    },
    'add user to buddy list': function() {
        var oldBuddies = ['testur_old@testur.com'];
        var buddies = _.union(oldBuddies, ['tetur_friend@testur.com']);
        service.setDao({
            find: function(user, cb) {
                cb(null, [{name: 'testur', buddies: oldBuddies}]);
            },
            update: function(user, cb) {
                assert.containsTheSame(user.buddies, buddies);
            }
        });
        service.addBuddy('tuster@testuc.com', 'testur_friesd@testur.com', function(added) {
            assert(added);
        });
    },
    'should only be possible to add existing users': function(){
        var testUser = 'tuster@testuc.com';
        var oldBuddies = ['testur_old@testur.com'];
        service.setDao({
            find: function(user, cb) {
                if(user.email == testUser) {
                    cb(null, [{name: 'testur', buddies: oldBuddies}]);    
                } else {
                    cb('user does not exists', null);
                }
            }
        });
        service.addBuddy(testUser, 'non_existing_buddy', function(added) {
            refute(added);
        });
    },
    'remove user from buddy list': function() {
        var buddies = ['testur_old@testur.com', 'tetur_friend@testur.com'];
        service.setDao({
            find: function(user, cb) {
                cb(null, [{name: 'testur', buddies: buddies}]);
            },
            update: function(user, cb) {
                refute.containsTheSame(user.buddies, buddies);
            }
        });
        service.removeBuddy('tuster@testuc.com', 'testur_old@testur.com', function(added) {
            assert(added);
        });  
    }
}); 
