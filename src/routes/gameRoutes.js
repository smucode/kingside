var util = require('../util/httputils');
var cache = require('../cache/userCache').UserCache;
var gameService = require('../services/gameService').GameService;

var GameRoutes = function() {};

GameRoutes.prototype.get = function(req, res, next){
    try {
        var user = cache.get(req);
        res.contentType('json');
        if(user) {
            gameService.findUserGames(user.email, function(games) {
                var json = games ? JSON.stringify(games) : '';
                res.send(json);
            });
        } else {
            res.send('{}');
        }
    } catch (e) {
        res.send(e);
    }
};

GameRoutes.prototype.setCache = function(cacheIn) {
    cache = cacheIn;
};

GameRoutes.prototype.setGameService = function(service) {
    gameService = service;
};

exports.GameRoutes = new GameRoutes();