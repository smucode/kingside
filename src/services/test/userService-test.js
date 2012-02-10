var vows = require('vows');
var buster = require("buster");
var service = require('../userService').UserService;

service.setDao({
    saveUser: function() {},
    findUser: function() {}
});

buster.testCase('user service', {
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
        assert.equals(testUser.email, lookingForUser.email);
        assert(daoCalled);
    },
    'if user does exist do not update it' : function() {
        var saveCalled = false, updateCalled = false, lookingForUser;
        service.setDao({
            saveUser: function(user) {
                saveCalled = true;
            },
            updateUser: function(user) {
                updateCalled = true;
            },
            findUser: function(user, cb) {
                lookingForUser = user;
                cb(null,[user]);
            }
        });
        var testUser = {firstname: 'firstname', lastname: 'lastname', email: 'user email'};
        service.saveUser(testUser);
        refute(saveCalled);
        assert(updateCalled);
    }
});
