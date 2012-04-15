var UserCache = function() {};

UserCache.prototype.cache = {};

UserCache.prototype.add = function(sid, user) {
    if(this.cache[sid]) {
        throw new Error("Sid is already used");
    }
    this.cache[sid] = user;
};

UserCache.prototype.get = function(sid) {
    return this.cache[sid];
};

UserCache.prototype.clearCache = function() {
    this.cache = {};
};

exports.UserCache = new UserCache();