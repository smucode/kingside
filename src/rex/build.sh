#!/bin/bash
jshint *
vows
browserify Board.js -o ../../dist/rex.js
uglifyjs ../../dist/rex.js > ../../dist/rex.min.js