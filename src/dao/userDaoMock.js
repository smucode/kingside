var _ = require('underscore');

UserDaoMock = function() {
    this.users = {
        "jontore@gmail.com": {
            name: "Jon Tore ",
            email: "jontore@gmail.com",
            buddies: ["kjell.t.ringen@gmail.com"]
        }

    };
};

UserDaoMock.prototype.init = function() {
    this.users = {};
};

UserDaoMock.prototype.save = function(user, cb) {
    cb = cb || function() {};
    this.users[user.email] = user;
    cb(null, user);
};

UserDaoMock.prototype.update = function(userIn, cb) {
    cb = cb || function() {};
    var user = this.users[userIn.email]; 
    this.users[user.email] = _.extend(user, userIn);
    cb(null, this.users[user.email]);
};

UserDaoMock.prototype.find = function(userIn, cb) {
    cb = cb || function() {};
    var user = this.users[userIn.email]; 
    cb(null, [user]);
};


exports.UserDaoMock = new UserDaoMock();
