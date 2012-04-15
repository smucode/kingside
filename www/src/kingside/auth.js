require.config({
    paths: {
        "underscore": '../../lib/underscore/underscore'
    },
    baseUrl: 'www/src/kingside'
});

define(['underscore'], function(_) {
    console.error('auth.js');
    var Auth = function() {
        return {
            getUser: function(cb) {
                $.getJSON('/user', _.bind(function(user) {
                    this.user = user;
                    cb(user);
                }, this));
            },
            isMe: function(email) {
                if (email == 'local') {
                    return true;
                }
                return this.user ? this.user.email == email : false;
            }
        };
    };
    // todo: this sucks...
    if(!window.auth) {
       window.auth = new Auth(); 
    }
    return window.auth;
});
