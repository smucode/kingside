var buddyService = require('../services/buddyService').BuddyService;
var util = require('../util/httputils');
var cache = require('../cache/userCache').UserCache;

var BuddyRoutes = function() {};

BuddyRoutes.prototype.get = function(req, res, next) {
    var user = cache.get(req);
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
};

BuddyRoutes.prototype.put = function(req, res) {
    var user = cache.get(req);
    var buddy = req.query.id;
    if(user && buddy) {
        buddyService.addBuddy(user.email, buddy, function(added) {
            res.send(added); 
        });    
    } else {
        res.send('User does not exists or add id', user, buddy);
    }
};

BuddyRoutes.prototype.del = function(req, res) {
    var user = cache.get(req);
    var buddy = req.query.id;
    if(user && buddy) {
        buddyService.removeBuddy(user.email, buddy, function(added) {
            res.send(added); 
        });    
    } else {
        res.send('User or buddy does not exists', user, buddy);
    }
};

exports.BuddyRoutes = new BuddyRoutes();