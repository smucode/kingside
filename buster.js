var config = module.exports;

config["browser test"] = {
  environment: "browser",
  autoRun: false,
  rootPath: 'www/src',
  libs: [
      '../lib/underscore/*.js',
      '../lib/requirejs/*.js',
      '../lib/require-jquery/*.js',
      '../lib/**/*.js'
  ],
  resources: [
      '**/*.js'
  ],
  tests: [
     "fooboard/test/alltest.js"
  ]
};

config["node test"] = {
  environment: "node",
    tests: [
       "./src/services/test/*.js",
       "./src/dao/test/*.js"
     ]
}
