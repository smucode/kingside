require.config({
  paths: {
    'cs': 'lib/cs',
    'jquery': 'lib/jquery',
    'backbone': 'lib/backbone',
    'underscore': 'lib/underscore',
    'coffee-script': 'lib/coffee-script'
  },
  shim: {
    /*'rivets': {
      exports: 'rivets'
    },*/
    'jquery': {
      exports: '$'
    },
    'underscore': {
      exports: '_'
    },
    'backbone': {
      exports: 'Backbone',
      deps: [
        'underscore',
        'jquery'
      ]
    }
  }
});