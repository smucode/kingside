var util = require('../util/httputils');
var auth = require('../auth/auth').auth;
var gameService = require('../services/gameService').GameService;

exports.routes = {
    '/user': function(req, res, next) {
        var sid = util.getSid(req.headers.cookie);
        var user = auth.getUser(sid);
        res.contentType('json'); 
        res.send(user ? JSON.stringify(user) : '');
    },
    '/games': function(req, res, next){
        try {
            var sid = util.getSid(req.headers.cookie);
            var user = auth.getUser(sid);
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
        var sid = util.getSid(req.headers.cookie);
        var user = auth.getUser(sid);
        res.contentType('json');
        if(user) {
            gameService.findUserGames(user.email, function(games) {
                res.send(games ? JSON.stringify(games) : '');
            });
        } else {
            res.send('');
        }
    }
};