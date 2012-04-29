var _ = require('underscore');
var buster = require('buster');
var assert = buster.assertions.assert;

var request = require('request');
var app = require('../app');

buster.testCase('REST api test', {
    setUp: function() {

    },
    'user data data gan be get from api': function(done) {
        var options = {
            uri: "http://localhost:8000/user",
            timeout: 200
        };
        request(options, function (error, response, body) {
            refute(error);
            assert.equals(response.statusCode, 200);
            done();
        });
    }
});