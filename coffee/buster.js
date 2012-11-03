module.exports['browser'] = {
  environment: 'browser',
  libs: [
    'lib/require.js',
    'lib/require.conf.js'
  ],
  resources: [
    'lib/cs.js',
    'lib/jquery.js',
    'lib/backbone.js',
    'lib/underscore.js',
    'lib/coffee-script.js'
  ],
  sources: [
    'src/*.coffee',
    'src/**/*.coffee'
  ],
  tests: [
    '**/test/*.coffee'
  ],
  extensions: [
    require('buster-amd')
  ],
  'buster-amd': {
    pathMapper: function (path) {
      return 'cs!' + path.replace(/^\//, '').replace(/\.coffee$/, '');
    }
  }
};