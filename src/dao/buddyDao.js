var _ = require('underscore');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var db = require('./db').Db;

BuddyDao = function() {};

BuddyDao._schema = new Schema({
    email: {type: String, required: true},
    buddies: [String]
});

BuddyDao.prototype._buddyModel = mongoose.model('Buddy', BuddyDao._schema);

BuddyDao.prototype.add = function(user, buddy, cb) {
    var query = {email: user};
    this._buddyModel.update(query, { $push : { buddies : buddy} }, {upsert: true},function(err, data) {
        if(err) {
            throw new Error('Could not persist buddy', buddy, err);
        } else {
            cb(err, data);
        }
    });
};

BuddyDao.prototype.remove = function(user, buddy, cb) {
  var query = {email: user};
    this._buddyModel.update(query, { $pull : { buddies : buddy} }, function(err, data) {
        if(err) {
            throw new Error('Could not persist buddy', buddy, err);
        } else {
            cb(err, data);
        }
    });  
};

BuddyDao.prototype.list = function(user, cb) {
    this._buddyModel.find({email: user}, function(err, data) {
        if(data && data.length > 0) {
            cb(err, _.first(data).buddies);    
        } else {
            cb(err);
        }
        
    });
};

BuddyDao.prototype.init = function() {
    db.connect();
};

exports.BuddyDao = new BuddyDao();