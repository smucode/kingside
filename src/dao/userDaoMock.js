var _ = require('underscore');

UserDaoMock = function() {
    this.users = {
        "jontore@gmail.com": {
            name: "Jon Tore ",
            email: "jontore@gmail.com",
            buddies: []
        }

    };
};

UserDaoMock.prototype.init = function() {
    this.users = {};
};


UserDaoMock.prototype.saveUser = function(user, cb) {
    cb = cb || function() {};
    this.users[user.email] = user;
    cb(null, user);
};

UserDaoMock.prototype.updateUser = function(userIn, cb) {
    cb = cb || function() {};
    var user = this.users[userIn.email]; 
    this.users[user.email] = _.extend(user, userIn);
    cb(null, this.users[user.email]);
};

UserDaoMock.prototype.findUser = function(userIn, cb) {
    cb = cb || function() {};
    var user = this.users[userIn.email]; 
    cb(null, [user]);
};


exports.UserDaoMock = new UserDaoMock();
