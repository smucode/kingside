if (typeof define !== 'function') { var define = (require('amdefine'))(module); }

define(["require", "underscore"], function(require, __) {
    
    var everyauth = require('everyauth');
    
    var Auth = function() {
        this._users = {};
        this._googleAuth();
    };
    
    Auth.prototype._googleAuth = function() {
        var that = this;
        everyauth.googlehybrid
            .myHostname('http://kingsi.de:8000')
            .consumerKey('kingsi.de')
            .consumerSecret('cJ_R8LWwNLwV6z71S-OD3wam')
            .scope(['https://www.googleapis.com/auth/userinfo.profile'])
            .findOrCreateUser(function (session, user, ctx) {
                var sid = ctx.req.sessionID;
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
    
    return new Auth();
});