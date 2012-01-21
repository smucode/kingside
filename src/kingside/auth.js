define(['underscore', 'src/kingside/socket'], function(_, socket) {
    
    return function() {
        var fns = [];
        var user = null;

        var fire = function() {
            if (user) {
                _.each(fns, function(fn) {
                    fn(user);
                });
            }
        };

        socket.on('auth', function (userinfo) {
            console.log('user', userinfo);
            user = userinfo;
            fire();
        });
        
        return {
            onAuth: function(fn) {
                fns.push(fn);
                if (user) {
                    fn(user);
                }
            }
        };
    };
});
