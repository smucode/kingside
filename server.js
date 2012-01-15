var connect = require('connect');

var port = process.env.PORT || 8000;

console.log('starting kingside on port ' + port);

connect(
    connect.static(__dirname + '/')
).listen(
    port
);
