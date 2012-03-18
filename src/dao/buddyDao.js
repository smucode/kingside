var _ = require('underscore');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var db = require('./db').Db;

BuddyDao = function() {};

BuddyDao._schema = new Schema({
    email: {type: String, required: true},
    buddies: [String]
});

UserDao.prototype._buddyModel = mongoose.model('Buddy', BuddyDao._schema);

BuddyDao.prototype.add = function(user, buddy, cb) {
    var query = {email: user.email};
    this._buddyModel.update(query, { $push : { buddies : buddy} }, function(err, data) {
        if(err) {
            throw new Error('Could not persist user', buddy, err);
        } else {
            cb(true);
        }
    });
};