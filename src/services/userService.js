var dao = require('../dao/db').Db;
var _ = require('underscore');

var UserService = function() {};

UserService.prototype.saveUser = function(user) {
    dao.findUser({email: user.email}, function(err, users) {
        if(_.isEmpty(users)) {
            dao.saveUser({name: user.firstname + ' ' + user.lastname, email: user.email},
                function() {
                    console.log('user saved', user);
                }
            );
        }
    });
};

UserService.prototype.setDao = function(inDao) {
    dao = inDao;
};

exports.UserService = new UserService();