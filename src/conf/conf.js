var _ = require('underscore');

var conf = {
    http: {
        port: process.env.PORT || 8000,
        server_root: __dirname + '/../../'
    }
};

_.each(conf, function(v, k) {
    exports[k] = v;
});
