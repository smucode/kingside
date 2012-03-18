var _ = require('underscore');
var buster = require('buster');
var buddyDaoMock = require('../buddyDaoMock.js').BuddyDaoMock;

var testCase = buster.testCase("buddy dao", {
    setUp: function() {
        buddyDaoMock.init();
    },
    'has a add buddy function' : function() {
        assert(buddyDaoMock.add);
    },
    'has a get buddy list function': function() {
        assert(buddyDaoMock.list);
    },
    'add a new buddy': function(user, buddy) {
        buddyDaoMock.add({email: 'testur'}, 'newBuddy@testur.com');
        assert.equals(buddyDaoMock.list({email: 'testur'}), ['newBuddy@testur.com']);
    },
    'remove a buddy': function(user, buddy) {
        buddyDaoMock.add({email: 'testur'}, 'newBuddy@testur.com');
        buddyDaoMock.remove({email: 'testur'}, 'newBuddy@testur.com');
        assert(buddyDaoMock.list({email: 'testur'}));
    }
});