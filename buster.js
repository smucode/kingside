var config = module.exports;

config["browser test"] = {
  environment: "browser",
  autoRun: false,
  rootPath: 'www',
  libs: [
      'lib/requirejs/*.js',
      'lib/require-jquery/*.js',
      'lib/underscore/*.js',
      'lib/jquery/*.js',
      'lib/jquery-ui/*.js',
      'lib/less/*.js'
  ],
  resources: [
      '**/*.js'
  ],
  tests: [
     "src/fooboard/test/alltest.js"
  ]
};

config["node test"] = {
  environment: "node",
    tests: [
       "./src/services/test/*.js",
       "./src/dao/test/*.js",
       "./src/routes/test/*.js"
     ]
}
