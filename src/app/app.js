var _ = require('underscore');
var express = require('express');
var conf = require('../conf/conf');
var auth = require('../auth/auth').auth;
var routes = require('../routes/routes').routes;
var db = require('../dao/db').Db;

var app = express.createServer();

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.cookieParser());
    app.use(express.session({
        key: conf.http.session.sid,
        secret: conf.http.session.secret 
    }));
    app.use(auth.middleware());
});

app.configure('development', function(){
    app.use(express['static'](conf.http.www_dir));
    app.use(express.errorHandler({ 
        dumpExceptions: true, 
        showStack: true 
    }));
});

_.each(routes.gets, function(v, k) {
    app.get(k, v);
});
_.each(routes.puts, function(v, k) {
    app.put(k, v);
});

app.listen(conf.http.port);
db.connect();

exports.app = app;
