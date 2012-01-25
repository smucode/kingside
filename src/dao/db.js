var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Connection = mongoose.Connection;

mongoose.connect('mongodb://kingside:queenside@ds029847.mongolab.com:29847/kingside');

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

Db.prototype._userModel = mongoose.model('User', User);
Db.prototype.saveUser = function(user, cb) {
   var user = new this._userModel({name: user.name, email: user.email});
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
        console.log(err, data);
        cb(err, data);
    });
}

Db.prototype._gameModel = mongoose.model('Game', Game);
Db.prototype.saveGame = function(player1, player2, fen, cb) {
    var game = new this._gameModel({player1: player1, player2: player2, fen: fen});
    return game.save(function(err){
        if(err) {
            console.error('Could not persist game', player1, player2, fen);
            cb(false);
         }
         cb(true);
    });
};

Db.prototype.disconnect = function() {
    mongoose.disconnect();
};

exports.Db = Db;
