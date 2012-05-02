var cache = require('../cache/userCache').UserCache;
var gameService = require('../services/gameService').GameService;

var UserRoutes = function() {};

UserRoutes.prototype.get = function(req, res, next) {
    var user = cache.get(req); 
    res.contentType('json'); 
    res.send(user ? JSON.stringify(user) : '');
};

UserRoutes.prototype.setCache = function(cacheIn) {
    cache = cacheIn;
};

exports.UserRoutes = new UserRoutes();