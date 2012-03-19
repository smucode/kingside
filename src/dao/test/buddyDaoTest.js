var _ = require('underscore');
var buster = require('buster');
var buddyDaoMock = require('../buddyDaoMock.js').BuddyDaoMock;
//var buddyDaoMock = require('../buddyDao.js').BuddyDao;

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
    'add a new buddy': function() {
        var user = 'testur';
        buddyDaoMock.add(user, 'newBuddyAdd@testur.com');
        buddyDaoMock.list(user, function(err, list) {
            assert.equals(['newBuddyAdd@testur.com'], list);
        });
    },
    'remove a buddy': function() {
        var user = 'testurRemove';
        buddyDaoMock.add(user, 'newBuddyRemove@testur.com');
        buddyDaoMock.remove(user, 'newBuddyRemove@testur.com');
        buddyDaoMock.list(user, function(err, list) {
            assert(list);
        });
    }
});