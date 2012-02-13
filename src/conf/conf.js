var _ = require('underscore');

var dev = (process.argv.length > 2 && process.argv[2] == 'dev');

console.log('dev mode = ' + dev);

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
    everyauth: {
        key: dev ? 'queensi.de' : 'kingsi.de',
        secret: dev ? '7vOH3w6d-97pjJfIjkg3Mr6i' : 'cJ_R8LWwNLwV6z71S-OD3wam',
        hostname: dev ? 'http://queensi.de:8000' : 'http://kingsi.de'
    },
    dev: dev
};

_.each(conf, function(v, k) {
    exports[k] = v;
});
