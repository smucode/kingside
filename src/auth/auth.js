var everyauth = require('everyauth');
var util = require('../util/httputils');
var userService = require('../services/userService').UserService;
var conf = require('../conf/conf');
var cache = require('../cache/userCache').UserCache;

var Auth = function() {
    this._users = {};
    this._googleAuth();
};

Auth.prototype._googleAuth = function() {
    var that = this;

    everyauth.everymodule.moduleErrback(function (err) {
        console.log('everyauth error', err);
    });

    everyauth.googlehybrid
        .myHostname(conf.everyauth.hostname)
        .consumerKey(conf.everyauth.key)
        .consumerSecret(conf.everyauth.secret)
        .scope(['https://www.googleapis.com/auth/userinfo.profile'])
        .findOrCreateUser(function (session, user, ctx) {
            var sid = util.getSid(ctx.req.headers.cookie);
            cache.add(sid, user);
            userService.create(user); //Should we do this here?
            return user.claimedIdentifier;
        })
        .redirectPath('/')
        .entryPath('/auth/google')
        .callbackPath('/auth/google/callback');
};

Auth.prototype.getUser = function(sid) {
    return this._users[sid];
};

Auth.prototype.middleware = function() {
    return everyauth.middleware();
};

exports.auth = new Auth();
