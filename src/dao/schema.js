var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Connection = mongoose.Connection;

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
Db.prototype.saveUser = function(user) {
   this._userModel.name = user.name;
   this._userModel.email = user.email;
   this._userModel.save(function(err) {
        if(err) console.error('Could not persist user', user);
    });
};

Db.prototype._gameModel = mongoose.model('Game', Game);
Db.prototype.saveGame = function(player1, player2, fen) {
    this._gameModel.player1 = player1;
    this._gameModel.player2 = player2;
    this._gameModel.fen = fen;
    this._gameModel.save(function(err) {
        if(err) console.error('Could not persist game', player1, player2, fen);  
    });
};

Db.prototype.disconnect = function() {
    mongoose.disconnect();
};

exports.Db = Db;
