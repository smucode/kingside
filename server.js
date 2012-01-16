var connect = require('connect');
var everyauth = require('everyauth');

everyauth.googlehybrid
    .myHostname('http://kingsi.de:8000')
    .consumerKey('kingsi.de')
    .consumerSecret('cJ_R8LWwNLwV6z71S-OD3wam')
    .scope(['https://www.googleapis.com/auth/userinfo.profile'])
    .findOrCreateUser( function (session, userAttributes) {
        console.error('user', session, userAttributes);
        return userAttributes.claimedIdentifier;
    })
.redirectPath('/');

var port = process.env.PORT || 8000;

console.log('starting kingside on port ' + port);

connect(
    connect.static(__dirname + '/build'),
    connect.bodyParser(),
    connect.cookieParser(),
    connect.session({secret: 'whodunnit'}),
    everyauth.middleware()
).listen(
    process.env.PORT || 8000
);
