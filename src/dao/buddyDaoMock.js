var _ = require('underscore');

var BuddyDaoMock = function() {
    this.users = {};
};

BuddyDaoMock.prototype.init = function() {
};

BuddyDaoMock.prototype.add = function(user, buddy) {
    this.users[user.email] = this.users[user.email] || [];
    this.users[user.email].push(buddy);
};

BuddyDaoMock.prototype.list = function(user) {
    return this.users[user.email];
};

BuddyDaoMock.prototype.remove = function(user, buddy) {
    this.users[user.email] = _.reject(this.users[user.email], function(el) {
        return el === buddy;
    });
};

exports.BuddyDaoMock = new BuddyDaoMock();