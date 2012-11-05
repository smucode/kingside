module.exports = function(grunt) {
  grunt.initConfig({
    clean: {
      folder: "target"
    },
    coffeelint: {
      app: [
        'src/*.coffee',
        'test/*.coffee'
      ],
    },
    coffeelintOptions: {
      "max_line_length": {
        "value": "125",
        "level": "error"
      }
    },
    coffee: {
      app: {
        src: ['src/*.coffee'],
        dest: 'target/src',
        options: { bare: true }
      },
      test: {
        src: ['test/*.coffee'],
        dest: 'target/test',
        options: { bare: true }
      }
    },
    concat: {
      all: {
        src: ['target/src/*.js'],
        dest: 'target/app.js'
      }
    },
    shell: {
      test: {
          command: 'vows test/*.coffee',
          stderr: true,
          stdout: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-clean');
  grunt.loadNpmTasks('grunt-coffee');
  grunt.loadNpmTasks('grunt-coffeelint');

  grunt.registerTask('default', [
    'clean', 
    'coffeelint', 
    'coffee', 
    'concat',
    'shell:test'
  ]);

};