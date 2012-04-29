var util = require('../util/httputils');
var cache = require('../cache/userCache').UserCache;
var gameService = require('../services/gameService').GameService;
var userRoutes = require('./userRoutes').UserRoutes;
var buddyRoutes = require('./buddyRoutes').BuddyRoutes;
var buddyService = require('../services/buddyService').BuddyService;

var Routes = function() {
};

var getUser = function(req) {
    var sid = util.getSid(req.headers.cookie);
    return cache.get(sid);
};

Routes.prototype.get = function() {
    return {
        '/user': userRoutes.get,
        '/buddies': buddyRoutes.get,
        '/games': function(req, res, next){
            try {
                var user = getUser(req);
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
        },
        '/request_game/': function(req, res, next){
            var user = getUser(req);
            res.contentType('json');
            if(user) {
                gameService.findUserGames(user.email, function(games) {
                    res.send(games ? JSON.stringify(games) : '');
                });
            } else {
                res.send('');
            }
        }
    }
};

Routes.prototype.put = function() {
    return {
        '/buddies': buddyRoutes.put
    }
};
    
Routes.prototype.del = function() {
    return {
        '/buddies': buddyRoutes.del
    }
};

exports.Routes = new Routes();