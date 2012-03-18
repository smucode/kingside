var _ = require('underscore');
var conf = require('../conf/conf');
var dao = require('../dao/userDao').UserDao;
var service = require('./userService').UserService;
var BuddyService = function() {};

BuddyService.prototype.getBuddyList = function(userId, cb) {
  cb = cb || function() {};
  service._getUser(userId, function(user) {
      if(user) {
          cb(user.buddies);
      } else {
          cb(null);
      }
  });
};

BuddyService.prototype.addBuddy = function(userId, buddy, cb) {
  cb = cb || function() {};
  service._getUser(userId, function(user) {
      if(user) {
            service._getUser(buddy, function(user) {
                if(!user) {
                    cb(false);
                } else {
                    var userIn = user;
                    userIn.buddies.push(buddy);
                    service._updateUser(userIn);
                    cb(true);          
                }
            });
      } else {
          cb(false);
      }
  });
};

BuddyService.prototype.removeBuddy = function(userId, buddy, cb) {
  cb = cb || function() {};
  service._getUser(userId, function(user) {
      if(user) {
          var userIn = user;
          userIn.buddies = _.without(user.buddies, buddy);
          service._updateUser(userIn);
          cb(true);      
      } else {
          cb(false);
      }
  });  
};

BuddyService.prototype.setDao = function(inDao) {
    service.setDao(inDao);
    dao = inDao;
};

exports.BuddyService = new BuddyService();