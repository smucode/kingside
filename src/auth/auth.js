var everyauth = require('everyauth');
var util = require('../util/httputils');

var Auth = function() {
    this._users = {};
    this._googleAuth();
};

Auth.prototype._googleAuth = function() {
    var that = this;
    
    // todo: figure out how to just register localhost here, so we don't need to flip with etc/hosts
    var hostname = (process.argv.length > 2 && process.argv[2] == 'dev') ? 'http://kingsi.de:8000' : 'http://kingsi.de';
    console.log('auth: hostname ' + hostname);

    everyauth.everymodule.moduleErrback(function (err) {
        console.log('err', err);
    });
    
    everyauth.googlehybrid
        .myHostname(hostname)
        .consumerKey('kingsi.de')
        .consumerSecret('cJ_R8LWwNLwV6z71S-OD3wam')
        .scope(['https://www.googleapis.com/auth/userinfo.profile'])
        .findOrCreateUser(function (session, user, ctx) {
            var sid = util.parseCookie(ctx.req.headers.cookie)['express.sid'];
            that._users[sid] = user;
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
