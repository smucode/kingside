module.exports['browser'] = {
  environment: 'browser',
  libs: [
    'lib/require.js',
    'src/config/requirejs-config.js'
  ],
  resources: [
    'lib/*.js',
    'src/**/*.html'
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