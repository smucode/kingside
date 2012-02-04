define(['underscore', './socket'], function(_, socket) {
    return (function() {
        return {
            getUser: function(cb) {
                $.getJSON('/user', _.bind(function(user) {
                    this.user = user;
                    cb(user);
                }, this));
            }
        };
    }());
});
