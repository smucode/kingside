var _ = require('underscore');

var BuddyDaoMock = function() {
    this.users = {};
};

BuddyDaoMock.prototype.init = function() {
};

BuddyDaoMock.prototype.add = function(user, buddy, cb) {
    cb = cb || function() {};
    this.users[user] = this.users[user] || [];
    this.users[user].push(buddy);
    cb();
};

BuddyDaoMock.prototype.list = function(user, cb) {
    cb({}, this.users[user]);
};

BuddyDaoMock.prototype.remove = function(user, buddy, cb) {
    cb = cb || function() {};
    this.users[user] = _.reject(this.users[user], function(el) {
        return el === buddy;
    });
    cb();
};

exports.BuddyDaoMock = new BuddyDaoMock();