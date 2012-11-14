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
        src: [
          'target/src/fen.js',
          'target/src/piece.js',
          'target/src/rook.js',
          'target/src/knight.js',
          'target/src/bishop.js',
          'target/src/king.js',
          'target/src/queen.js',
          'target/src/pawn.js',
          'target/src/piece_factory.js',
          'target/src/board.js'
        ],
        dest: 'target/rex.js'
      }
    },
    shell: {
      build: {
          command: 'coffee build/build.coffee',
          stderr: true,
          stdout: true
      },
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
    'shell:build',
    'shell:test'
  ]);

};