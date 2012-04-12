var config = module.exports;

config["browser test"] = {
  environment: "browser",
  autoRun: false,
  libs: [
      'www/lib/require-jquery/*.js',
      'www/lib/underscore/*.js',
      'www/lib/jquery/*.js',
      'www/lib/jquery-ui/*.js',
      'www/lib/less/*.js'
  ],
  sources: [
      'src/**/*.js',
      'www/src/**/*.js'
  ],
  tests: [
     "www/src/fooboard/test/fooboard_test.js"
  ],
  extensions: [require("buster-amd")]
};

config["node test"] = {
  rootPath: "src",
  environment: "node",
  tests: [
     "./services/test/*.js",
     "./dao/test/*.js",
     "./routes/test/*.js"
  ]
}
