var config = module.exports;

config["browser test"] = {
  environment: "browser",
    libs: [
        './www/lib/underscore/*.js',
        './www/lib/requirejs/*.js',
        './www/lib/require-jquery/*.js',
        './www/lib/**/*.js',
    ],
    sources: [
        './www/src/fooboard/fooboard.js'
    ],
    tests: [
       "./www/src/fooboard/test/*.js",
     ]
};

config["node test"] = {
  environment: "node",
    tests: [
       "./src/services/test/*.js"
     ]
}
