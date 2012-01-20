var _ = require('underscore');
var io = require('socket.io');
var connect = require('connect');
var everyauth = require('everyauth');

var port = process.env.PORT || 8000;

var users = {};

//google authorization
everyauth.googlehybrid
    .myHostname('http://kingsi.de:8000')
    .consumerKey('kingsi.de')
    .consumerSecret('cJ_R8LWwNLwV6z71S-OD3wam')
    .scope(['https://www.googleapis.com/auth/userinfo.profile'])
    .findOrCreateUser( function (session, userAttributes, ctx) {
        var sid = ctx.req.sessionID;
        console.log('g: ', sid);
        users[sid] = userAttributes;
        return userAttributes.claimedIdentifier;
    })
    .redirectPath('/')
    .entryPath('/auth/google')
    .callbackPath('/auth/google/callback');

console.log('starting kingside on port ' + port);

var server = connect(
    connect.static(__dirname),
    connect.bodyParser(),
    connect.cookieParser(),
    connect.session({secret: 'secret', key: 'express.sid'}),
    everyauth.middleware()
);

var io = require('socket.io').listen(server);
io.set('log level', 1);

var parseCookie = function(cookies) {
    var s = {};
    _.each(cookies.split(';\ '), function(c) {
        var vals = c.split('=');
         s[vals[0]] = vals[1];
    });
    return s;
};

io.sockets.on('connection', function (socket) {
    var sid = socket.handshake.sessionID;
    if (sid) {
        console.log('s: ', sid);
        var u = users[decodeURIComponent(sid)];
        if (u) {
            socket.emit('auth', u);
        }
    }
    
    socket.on('/start_game', function() {
        console.log('start game from ' + sid);
    });
    
});

io.set('authorization', function (data, accept) {
    if (data.headers.cookie) {
        data.cookie = parseCookie(data.headers.cookie);
        data.sessionID = data.cookie['express.sid'];
    }
    accept(null, true);
});

server.listen(port);
