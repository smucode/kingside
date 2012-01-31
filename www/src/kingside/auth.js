define(['underscore', './socket'], function(_, socket) {
    
    return (function() {
        var fns = [];

        var fire = function() {
            if (socket.user) {
                _.each(fns, function(fn) {
                    fn(socket.user);
                });
            }
        };

        socket.on('auth', function (user) {
            socket.user = user;
            fire();
        });
        
        return {
            onAuth: function(fn) {
                fns.push(fn);
                if (socket.user) {
                    fn(socket.user);
                }
            },
            getUser: function() {
                return socket.user;
            }
        };
    }());
});
