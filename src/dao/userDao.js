var _ = require('underscore');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var db = require('./db').Db;

UserDao = function() {};

UserDao._schema = new Schema({
    name : {type: String},
    email: {type: String, required: true, index: { unique: true }}
});

UserDao.prototype._userModel = mongoose.model('User', UserDao._schema);

UserDao.prototype._validateUser = function(userIn) {
   if(!userIn || _.isEmpty(userIn)) {
       throw new Error('Could not persist user incorrect parameters', userIn);
   }
};

UserDao.prototype.saveUser = function(userIn, cb) {
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

UserDao.prototype.updateUser = function(userIn,  cb) {
   cb = cb || function() {};
   this._validateUser(userIn, cb);
    this._userModel.update(query,
        {name: userIn.name},
        function(err, data) {
            if(err) {
                throw new Error('Could not search for user', user, err);
            }
            cb(err, data);
       }
    );
};

UserDao.prototype.findUser = function(data, cb) {
    this._userModel.find(data, function(err, data) {
        cb(err, data);
    });
};

UserDao.prototype.removeUsers = function(key, cb) {
    this.findUser(key, function(err, users) {
        _.each(users, function(user) {
            user.remove();
        }, this);
        cb();
    });
};

exports.UserDao = new UserDao();
