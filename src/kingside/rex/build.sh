#!/bin/bash
jshint *
vows
browserify Board.js -o ../rex.js
uglifyjs ../rex.js > ../rex.min.js