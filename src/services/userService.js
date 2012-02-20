var _ = require('underscore');
var conf = require('../conf/conf');
//var dao = conf.dev ? require('../dao/userDaoMock').UserDaoMock : require('../dao/userDao').UserDao;
var dao = require('../dao/userDao').UserDao;
var UserService = function() {};

UserService.prototype.create = function(user) {
    var that = this;
    this.doesUserExists(user.email, function(exists) {
        var userIn = {name: user.firstname + ' ' + user.lastname, email: user.email};
        if(exists) {
            that._updateUser(userIn);
        } else {
            that._saveUser(userIn);
        }
    });
};

UserService.prototype._updateUser = function(userIn) {
    dao.update(userIn, function(err, user) {
        console.log('user updated', user);
    });
};

UserService.prototype._saveUser = function(userIn) {
    dao.save(userIn, function(err, user) {
        console.log('user saved', user);
    });
};

UserService.prototype.doesUserExists = function(userId, cb) {
    cb = cb || function() {};
    this._getUser(userId, function(user) {
        if(user) {
            cb(true);  
        } else {
            cb(false);
        }
    }); 
};

UserService.prototype.getBuddyList = function(userId, cb) {
  cb = cb || function() {};
  this._getUser(userId, function(user) {
      if(user) {
          cb(user.buddies);
      } else {
          cb(null);
      }
  });
};

UserService.prototype.addBuddy = function(userId, buddy, cb) {
  cb = cb || function() {};
  var that = this;
  this._getUser(userId, function(user) {
      if(user) {
            that._getUser(buddy, function(user) {
                if(!user) {
                    cb(false);
                } else {
                    var userIn = user;
                    userIn.buddies.push(buddy);
                    that._updateUser(userIn);
                    cb(true);          
                }
            });
      } else {
          cb(false);
      }
  });
};

UserService.prototype.removeBuddy = function(userId, buddy, cb) {
  cb = cb || function() {};
  var that = this;
  this._getUser(userId, function(user) {
      if(user) {
          var userIn = user;
          userIn.buddies = _.without(user.buddies, buddy);
          that._updateUser(userIn);
          cb(true);      
      } else {
          cb(false);
      }
  });  
};

UserService.prototype._getUser = function(userId, cb) { 
    dao.find({email: userId}, function(err, users) {
      if(!err && users && users.length == 1) {
          cb(_.first(users));
      } else {
          cb(null);
      }
  });  
};

UserService.prototype.setDao = function(inDao) {
    dao = inDao;
};

exports.UserService = new UserService();
