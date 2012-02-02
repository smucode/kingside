var express = require('express');
var util = require('./src/util/httputils');

var auth = require('./src/auth/auth').auth;
var gameService = require('./src/services/gameService').GameService;
var RemoteGameService = require('./src/game/remoteGameService').RemoteGameService;

var app = express.createServer();

var io = require('socket.io').listen(app);
var remoteGameService = new RemoteGameService(io);

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.cookieParser());
    app.use(express.session({ secret: "keyboard cat", key: 'express.sid' }));
    app.use(auth.middleware());
});

app.configure('development', function(){
    app.use(express.static(__dirname));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/user', function(req, res, next){
    var sid = util.parseCookie(req.headers.cookie)['express.sid'];
    var user = auth.getUser(sid);
    res.contentType('json'); 
    res.send(user ? JSON.stringify(user) : '');
});

app.get('/games', function(req, res, next){
    var sid = util.parseCookie(req.headers.cookie)['express.sid'];
    var user = auth.getUser(sid);
    res.contentType('json');
    if(user) {
        gameService.findUserGames(user.email, function(games) {
            res.send(games ? JSON.stringify(games) : '');
        });
    } else {
        res.send('');
    }
});

app.get('/request_game/', function(req, res, next){
    var sid = util.parseCookie(req.headers.cookie)['express.sid'];
    var user = auth.getUser(sid);
    res.contentType('json');
    if(user) {
        gameService.findUserGames(user.email, function(games) {
            res.send(games ? JSON.stringify(games) : '');
        });
    } else {
        res.send('');
    }
});

app.listen(8000);
remoteGameService.listen();