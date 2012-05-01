var config = module.exports;

config["node test"] = {
  environment: "node",
    tests: [
       "src/services/test/*.js",
       "src/dao/test/*.js",
       "src/routes/test/*.js",
       "src/cache/test/*.js"
     ],
    extensions: [require("buster-lint")],
    "buster-lint": require("./autolint")
};

// config["browser test"] = {
//   environment: "browser",
//   autoRun: false,
//   rootPath: 'www',
//   libs: [
//       'lib/requirejs/*.js',
//       'lib/require-jquery/*.js',
//       'lib/underscore/*.js',
//       'lib/jquery/*.js',
//       'lib/jquery-ui/*.js',
//       'lib/less/*.js'
//   ],
//   sources: [
//       '**/*.js'
//   ],
//   tests: [
//      "src/fooboard/test/fooboard_test.js"
//   ],
//   extensions: [require("buster-amd")]
// };