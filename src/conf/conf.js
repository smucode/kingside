var _ = require('underscore');

var dev = (process.argv.length > 2 && process.argv[2] == 'dev');

var conf = {
    debug: false,
    http: {
        port: process.env.PORT || 8000,
        server_root: __dirname + '/../../',
        session: {
            sid: 'express.sid',
            secret: 'tacocat is a palindrome'
        },
        www_dir: dev ? __dirname + '/../..' : __dirname + '/../../www'
    },
    dev: dev

};

_.each(conf, function(v, k) {
    exports[k] = v;
});
