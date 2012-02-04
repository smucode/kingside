var _ = require('underscore');

var conf = {
    http: {
        port: process.env.PORT || 8000,
        server_root: __dirname + '/../../',
        session: {
            sid: 'express.sid',
            secret: 'tacocat is a palindrome'
        }
    }
};

_.each(conf, function(v, k) {
    exports[k] = v;
});
