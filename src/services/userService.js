var _ = require('underscore');
var conf = require('../conf/conf');
var dao = conf.dev ? require('../dao/userDaoMock').UserDaoMock : require('../dao/userDao').UserDao;
var UserService = function() {};

UserService.prototype.saveUser = function(user) {
    var that = this;
    dao.findUser({email: user.email}, function(err, users) {
        var userIn = {name: user.firstname + ' ' + user.lastname, email: user.email};
        if(_.isEmpty(users)) {
            that._saveUser(userIn, user);
        } else {
            that._updateUser(userIn, user);
        }
    });
};

UserService.prototype.setDao = function(inDao) {
    dao = inDao;
};

UserService.prototype._updateUser = function(userIn, user) {
    dao.updateUser(userIn, function () {
        console.log('user updated', user);
    });
};

UserService.prototype._saveUser = function(userIn, user) {
    dao.saveUser(userIn, function () {
        console.log('user saved', user);
    });
};

exports.UserService = new UserService();
