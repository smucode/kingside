var _ = require('underscore');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var db = require('./db').Db;

UserDao = function() {};

UserDao._schema = new Schema({
    name : {type: String},
    email: {type: String, required: true},
    buddies: [String]
});

UserDao.prototype._userModel = mongoose.model('User', UserDao._schema);

UserDao.prototype._validateUser = function(userIn) {
   if(!userIn || _.isEmpty(userIn)) {
       throw new Error('Could not persist user incorrect parameters', userIn);
   }
};

UserDao.prototype.save = function(userIn, cb) {
   cb = cb || function() {};
   this._validateUser(userIn, cb);
   var user = new this._userModel(userIn);
   return user.save(function(err) {
        if(err) {
            throw new Error('Could not persist user', user, err);
        } else {
            cb(true);
        }
    });
};

UserDao.prototype.update = function(userIn,  cb) {
   cb = cb || function() {};
   this._validateUser(userIn, cb);
    var query = {email: userIn.email};
    var input =  {name: userIn.name};
    if(userIn.buddies) {
      input.buddies = userIn.buddies;
    }
    this._userModel.update(query, input,
        function(err, data) {
            if(err) {
                throw new Error('Could not update for user', userIn, err);
            }
            cb(err, data);
       }
    );
};

UserDao.prototype.find = function(data, cb) {
    this._userModel.find(data, function(err, data) {
        cb(err, data);
    });
};

UserDao.prototype.remove = function(key, cb) {
    this.findUser(key, function(err, users) {
        _.each(users, function(user) {
            user.remove();
        }, this);
        cb();
    });
};

exports.UserDao = new UserDao();
