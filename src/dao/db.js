var _ = require('underscore');
var mongoose = require('mongoose');

var Db = function() {
};

Db.prototype.connect = function() {
    var hostname = 'mongodb://kingside:queenside@ds029847.mongolab.com:29847/kingside'; //'mongodb://localhost/kingside';
    mongoose.connect(hostname);
};

Db.prototype.disconnect = function() {
    mongoose.disconnect();
};

exports.Db = new Db();
