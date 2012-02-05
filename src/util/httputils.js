var _ = require('underscore');
var conf = require('../conf/conf');

exports.parseCookie = function(cookie) {
    var s = {};
    if (cookie) {
        _.each(cookie.split(';\\ '), function(c) {
            var vals = c.split('=');
             s[vals[0]] = vals[1];
        });
    }
    return s;
};

exports.getSid = function(cookie) {
    var sid = exports.parseCookie(cookie)[conf.http.session.sid];
    if (conf.debug) {
        console.log('got sid: ', sid);
    }
    return sid;
};
