#!/bin/bash
vows
browserify Board.js -o rex.js
uglifyjs rex.js > rex.min.js
echo "- kthxbye -"
