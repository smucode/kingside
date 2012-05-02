var util = require('../util/httputils');
var UserCache = function() {};

UserCache.prototype.cache = {};

UserCache.prototype.add = function(sid, user) {
    if(this.cache[sid]) {
        throw new Error("Sid is already used");
    }
    this.cache[sid] = user;
};

UserCache.prototype.get = function(req) {
    var sid;
    if(req.headers) {
        sid = util.getSid(req.headers.cookie);
    } else {
        sid = req;
    } 
    return this.cache[sid];
};

UserCache.prototype.clearCache = function() {
    this.cache = {};
};

UserCache.prototype.setUtil = function(mockedUtil) {
    util = mockedUtil;
};

exports.UserCache = new UserCache();