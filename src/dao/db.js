var _ = require('underscore');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = new Schema({
    name : {type: String},
    email: {type: String, required: true, index: { unique: true }}
});

var Game = new Schema({
    gameId: {type: String},
    w: {type: String},
    b: {type: String},
    fen: {type: String},
    date: {type: Date, default: Date.now}
});

var Db = function() {
    this.connect();
};

Db.prototype.connect = function() {
    var hostname = 'mongodb://kingside:queenside@ds029847.mongolab.com:29847/kingside'; //'mongodb://localhost/kingside';
    mongoose.connect(hostname);
};

Db.prototype._userModel = mongoose.model('User', User);
Db.prototype.saveUser = function(userIn, cb) {
   cb = cb || function() {};
   if(!userIn || _.isEmpty(userIn)) {
       console.error('Could not persist user incorrect parameters', userIn);
       cb(false);
       return;
   }
   var user = new this._userModel({name: userIn.name, email: userIn.email});
   return user.save(function(err) {
        if(err) {
            console.error('Could not persist user', user, err);
            cb(false);
        }
        cb(true);
    });
};
Db.prototype.findUser = function(data, cb) {
    this._userModel.find(data, function(err, data) {
        cb(err, data);
    });
};

Db.prototype.removeUsers = function(key, cb) {
    this.findUser(key, function(err, users) {
        _.each(users, function(user) {
            user.remove();
        }, this);
        cb();
    });
};

Db.prototype._gameModel = mongoose.model('Game', Game);
Db.prototype.saveGame = function(id, w, b, fen, cb) {
    cb = cb || function() {};
    if(!id || !w || !b || !fen) {
        console.error("Could not persist game incorrect parameters", w, b, fen);
        cb(false);
        return;
    }

    var game = new this._gameModel({gameId: id, w: w, b: b, fen: fen});
    return game.save(function(err){
        if(err) {
            console.error('Could not persist game', w, b, fen);
            cb(false);
         }
         cb(true);
    });
};
Db.prototype.findGame = function(data, cb) {
    console.log('looking for game', data, cb);
    this._gameModel.find(data, function(err, data) {
        if(err) {
            console.error('Could not search for game', err);
        }
        cb(err, data);
    });
};

Db.prototype.findUserGames = function(user, cb) {
    if(!user) {
        console.error('User must be defined in order to find its games');
        return;
    }
    this._gameModel.find({$or: [{w: user}, {b: user}]}, cb);
};

Db.prototype.removeGames = function(key, cb) {
    this.findGame(key, function(err, games) {
        console.log('looking for games');
        if(err) {
            console.log('Could not remove games');
            cb();
        }
        _.each(games, function(game) {
            game.remove();
        }, this);
        cb();
    });
};

Db.prototype.disconnect = function() {
    mongoose.disconnect();
};

exports.Db = new Db();
