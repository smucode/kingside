var connect = require('connect');
var everyauth = require('everyauth');
var dnode = require('dnode');

var port = process.env.PORT || 8000;

var userInfo = {
    user: 'No one'
};

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
).listen(
    process.env.PORT || 8000
);
    
//dnode 
var dnode_server = dnode({
    user : function(cb) { 
        cb(userInfo);
    }
}).listen(3000);

