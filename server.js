var connect = require('connect');
var everyauth = require('everyauth');

var port = process.env.PORT || 8000;

//google authorization
everyauth.googlehybrid
    .myHostname('http://kingsi.de:8000')
    .consumerKey('kingsi.de')
    .consumerSecret('cJ_R8LWwNLwV6z71S-OD3wam')
    .scope(['https://www.googleapis.com/auth/userinfo.profile'])
    .findOrCreateUser( function (session, userAttributes) {
        userInfo = userAttributes;
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
    connect.session({secret: 'whodunnit'}),
    everyauth.middleware()
);

server.listen(
    process.env.PORT || 8000
);
