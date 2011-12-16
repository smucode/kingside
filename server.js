var express = require('express');
var app = express.createServer();
app.listen(8000);

var bundle = require('browserify')(__dirname + '/src/kingside/kingside.js');
app.use(bundle);