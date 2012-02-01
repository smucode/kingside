var express = require('express');
var auth = require('./src/auth/auth').auth;
var util = require('./src/util/httputils');

var app = express.createServer();

var io = require('socket.io').listen(app);

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

app.listen(8000);
