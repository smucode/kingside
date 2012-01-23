
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Connection = mongoose.Connection;

mongoose.connect('mongodb://localhost/kingside');

var User = new Schema({
    name : {type: String},
    email: {type: String, required: true, index: { unique: true }},
    sid  : {type: String, index: { unique: true }}
});

var User = mongoose.model('User', User);

var testUser = new User({name: 'Testur Testurson', email: 'testur@email.com', sid: 'ette'});

testUser.save(function(err) {
    if(!err) console.log('User save');
    mongoose.disconnect();
});

