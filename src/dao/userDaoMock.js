var _ = require('underscore');

UserDaoMock = function() {};

UserDaoMock.prototype.init = function() {
    this.users = {};
};

UserDaoMock.prototype.saveUser = function(user, cb) {
    cb = cb || function() {};
    this.users[user.email] = user;
    cb(true);
};

UserDaoMock.prototype.updateUser = function(userIn, cb) {
    cb = cb || function() {};
    var user = this.users[userIn.email]; 
    this.users[user.email] = _.extend(user, userIn);
    cb(true);
};

UserDaoMock.prototype.findUser = function(userIn, cb) {
    cb = cb || function() {};
    var user = this.users[userIn.email]; 
    cb(null, user);
};


exports.UserDaoMock = new UserDaoMock();
