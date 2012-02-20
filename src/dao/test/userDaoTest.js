var _ = require('underscore');
var buster = require('buster');
var userDaoMock = require('../userDaoMock.js').UserDaoMock;


var assertPersisted = function(expected) {
   userDaoMock.find({email: expected.email}, function(err, user) {
       assert.equals(expected, _.first(user));
   });
};
var testCase = buster.testCase("user dao", {
    setUp: function() {
        userDaoMock.init();
    },
    'has a save user' : function() {
        assert(userDaoMock.save);
    },
    'has a find user' : function() {
        assert(userDaoMock.find);
    },
    'has a update user' : function() {
        assert(userDaoMock.update);
    },
    'saving user returns true when user is persisted': function() {
       var testUser = {name: 'test name', email: 'test@email.com'};
       userDaoMock.save(testUser, function(err, saved) {
           assert(saved);
       });
    },
    'after saving a user it should be possible to read it back out' : function() {
        var testUser = {name: 'test name', email: 'test@email.com'};
        userDaoMock.save(testUser);
        assertPersisted(testUser);
    },
    'user updates is persisted': function() {
       var testUser = {name: 'test name', email: 'test@email.com'};
       userDaoMock.save(testUser);
       var updateUser = {name: 'updated user name', email: testUser.email};  
       userDaoMock.update(updateUser);
       assertPersisted(updateUser);
    }
});
