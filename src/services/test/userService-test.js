var vows = require('vows');
var assert = require('assert');
var service = require('../userService').UserService;

service.setDao({
    saveUser: function() {},
    findUser: function() {}
});

vows.describe('db').addBatch({
    'save user' : {
        'if user does not exist save it' : function() {
            var daoCalled, lookingForUser;
            service.setDao({
                saveUser: function(user) {
                    daoCalled = true;
                },
                findUser: function(user, cb) {
                    lookingForUser = user;
                    cb(null,[]);
                }
            });
            var testUser = {firstname: 'firstname', lastname: 'lastname', email: 'user email'};
            service.saveUser(testUser);
            assert.equal(testUser.email, lookingForUser.email);
            assert.isTrue(daoCalled);
        },
        'if user does exist do not save it' : function() {
            var daoCalled = false, lookingForUser;
            service.setDao({
                saveUser: function(user) {
                    daoCalled = true;
                },
                findUser: function(user, cb) {
                    lookingForUser = user;
                    cb(null,[user]);
                }
            });
            var testUser = {firstname: 'firstname', lastname: 'lastname', email: 'user email'};
            service.saveUser(testUser);
            assert.isFalse(daoCalled);
        }
    }

})["export"](module);