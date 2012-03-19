var _ = require('underscore');
var vows = require('vows');
var buster = require("buster");
var service = require('../buddyService').BuddyService;

buster.testCase('buddy list', {
    "lookup users buddy list": function() {
        var friends = ['testur_friend@testur.com', 'testur_frind2@testur.com'];
        service.setDao({
            list: function(user, cb) {
                cb(null, friends);
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
            add: function(user, buddy, cb) {
                cb(null, oldBuddies);
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
            add: function(user, buddy, cb) {
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
            remove: function(user, buddy, cb) {
                cb();
            }
        });
        service.removeBuddy('tuster@testuc.com', 'testur_old@testur.com', function(added) {
            assert(added);
        });  
    }
}); 