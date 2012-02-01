var _ = require('underscore');

exports.parseCookie = function(cookie) {
    var s = {};
    _.each(cookie.split(';\ '), function(c) {
        var vals = c.split('=');
         s[vals[0]] = vals[1];
    });
    return s;
};