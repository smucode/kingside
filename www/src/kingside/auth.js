define(['underscore', './socket'], function(_, socket) {
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
