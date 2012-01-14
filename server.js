var connect = require('connect');

connect(
    connect.static(__dirname + '/')
).listen(
    process.env.PORT || 8000
);