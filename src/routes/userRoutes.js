var util = require('../util/httputils');
var cache = require('../cache/userCache').UserCache;
var gameService = require('../services/gameService').GameService;

var UserRoutes = function() {};

var getUser = function(req) {
    var sid = util.getSid(req.headers.cookie);
    return cache.get(sid);
};

UserRoutes.prototype.get = function(req, res, next) {
    var user = getUser(req); 
    res.contentType('json'); 
    res.send(user ? JSON.stringify(user) : '');
};

UserRoutes.prototype.setCache = function(cacheIn) {
    getUser = function(req) {
        return cache.get();
    };
    cache = cacheIn;
};

exports.UserRoutes = new UserRoutes();