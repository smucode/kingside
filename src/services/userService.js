var db = require('../dao/db').Db;
var _ = require('underscore');

var UserService = function() {};

UserService.prototype.saveUser = function(user) {
    db.findUser({email: user.email}, function(err, users) {
        if(_.isEmpty(users)) {
            db.saveUser({name: user.firstname + ' ' + user.lastname, email: user.email},
                function() {
                    console.log('user saved', user);
                }
            );
        }
    });
};

exports.UserService = new UserService();