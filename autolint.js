module.exports = {
  paths: [ 
    "./www/src/**/*.js",
    "./src/**/*.js"
  ],
  linter: "jslint",
  jslintOptions : {
    indent: 4,
    maxlen: 125,
    node: true,
    white: true,
    undef: true,
    nomen: true,
    sloppy: true,
    vars: true,
    eqeq: true,
    plusplus: true,
    bitwise: true,
    regexp: true
 },
  linterOptions: {          // see default-configuration.js for a list of all options
    predef: ['$', '_']              // a list of known global variables
  },
  excludes: [
    "jquery",
    "underscore",
    "garbo",
    "ga"
  ]              
};
