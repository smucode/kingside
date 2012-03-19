var util = require('../util/httputils');
var auth = require('../auth/auth').auth;
var gameService = require('../services/gameService').GameService;
var userService = require('../services/userService').UserService;
var buddyService = require('../services/buddyService').BuddyService;

var getUser = function(req) {
    var sid = util.getSid(req.headers.cookie);
    return auth.getUser(sid);
};

exports.routes = {
    gets: {
        '/user': function(req, res, next) {
            var user = getUser(req); 
            res.contentType('json'); 
            res.send(user ? JSON.stringify(user) : '');
        },
        '/buddies': function(req, res, next) {
            var user = getUser(req);
            res.contentType('json');
            if(user) {
                buddyService.getBuddyList(user.email, function(buddies) {
                    if(buddies) {
                        var json = buddies ? JSON.stringify(buddies) : '';
                        res.send(json);    
                    } else {
                        res.send('{}');
                    }
                });    
            } else {
                res.send('{}');
            }
            
        },
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
    },
    puts: {
        '/add_buddy/': function(req, res) {
            var user = getUser(req);
            var buddy = req.query.id;
            if(user && buddy) {
                buddyService.addBuddy(user.email, buddy, function(added) {
                    res.send(added); 
                });    
            } else {
                res.send('User does not exist');
            }
            
        }
    }
};