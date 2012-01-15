var connect = require('connect');
var everyauth = require('everyauth');

everyauth.googlehybrid
    .myHostname('http://kingsi.de:8000')
    .consumerKey('kingsi.de')
    .consumerSecret('cJ_R8LWwNLwV6z71S-OD3wam')
    .scope(['https://www.googleapis.com/oauth2/v1/userinfo'])
    .findOrCreateUser( function (session, userAttributes) {
    })
    .moduleErrback( function (err) {
        console.log('Failed', err);
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
