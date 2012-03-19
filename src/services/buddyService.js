var _ = require('underscore');
var conf = require('../conf/conf');
var dao = conf.dev ? require('../dao/buddyDaoMock').BuddyDaoMock : require('../dao/buddyDao').BuddyDao;
var BuddyService = function() {};

BuddyService.prototype.getBuddyList = function(userId, cb) {
  cb = cb || function() {};
  dao.list(userId, function(err, list) {
    cb(list);
  });
};

BuddyService.prototype.addBuddy = function(userId, buddy, cb) {
  cb = cb || function() {};
  dao.add(userId, buddy, function(err, data) {
    if(err) {
        cb(false);
    } else {
        cb(true);        
    }
  });
};

BuddyService.prototype.removeBuddy = function(userId, buddy, cb) {
  cb = cb || function() {};
  dao.remove(userId, buddy, function(err, data) {
    if(err) {
        cb(false);
    } else {
        cb(true);        
    }
  });
};

BuddyService.prototype.setDao = function(inDao) {
    dao = inDao;
};

exports.BuddyService = new BuddyService();