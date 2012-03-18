var _ = require('underscore');

var BuddyDaoMock = function() {
    this.users = {};
};

BuddyDaoMock.prototype.init = function() {
};

BuddyDaoMock.prototype.add = function(user, buddy, cb) {
    cb = cb || function() {};
    this.users[user.email] = this.users[user.email] || [];
    this.users[user.email].push(buddy);
    cb();
};

BuddyDaoMock.prototype.list = function(user, cb) {
    cb(this.users[user.email]);
};

BuddyDaoMock.prototype.remove = function(user, buddy, cb) {
    cb = cb || function() {};
    this.users[user.email] = _.reject(this.users[user.email], function(el) {
        return el === buddy;
    });
    cb();
};

exports.BuddyDaoMock = new BuddyDaoMock();