var _ = require('underscore');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var db = require('./db').Db;

BuddyDao = function() {};

BuddyDao._schema = new Schema({
    email: {type: String, required: true},
    buddies: [String]
});