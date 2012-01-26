var _ = require('underscore');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Connection = mongoose.Connection;

var User = new Schema({
    name : {type: String},
    email: {type: String, required: true, index: { unique: true }}
});

var Game = new Schema({
    player1: {type: String},
    player2: {type: String}, 
    fen: {type: String},
    date: {type: Date, default: Date.now}
});

var Db = function() {};

Db.prototype.connect = function() {
    mongoose.connect('mongodb://kingside:queenside@ds029847.mongolab.com:29847/kingside');
};

Db.prototype._userModel = mongoose.model('User', User);
Db.prototype.saveUser = function(userIn, cb) {
   cb = cb || function() {};
   if(!userIn || _.isEmpty(userIn)) {
       console.error('Could not persist user incorrect parameters', userIn);
       cb(false);
       return;
   }
   console.log('saving user', userIn);
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
Db.prototype.saveGame = function(player1, player2, fen, cb) {
    cb = cb || function() {};
    if(!player1 || !player2 || !fen) {
        console.error("Could not persist game incorrect parameters", player1, player2, fen);
        cb(false);
        return;
    }

    var game = new this._gameModel({player1: player1, player2: player2, fen: fen});
    return game.save(function(err){
        if(err) {
            console.error('Could not persist game', player1, player2, fen);
            cb(false);
         }
         cb(true);
    });
};
Db.prototype.findGame = function(data, cb) {
    this._gameModel.find(data, function(err, data) {
        if(err) {
            console.error('Could not search for game', err);
        }
        cb(err, data);
    });
};

Db.prototype.removeGames = function(key, cb) {
    this.findUser(key, function(err, games) {
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
