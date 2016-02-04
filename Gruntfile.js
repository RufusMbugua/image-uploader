/*jslint node: true */
"use strict";


module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    bower: {
      dev: {
        dest: 'libs/',
        css_dest: 'libs/styles',
        js_dest: 'libs/js',
        fonts_dest: 'libs/fonts',
        less_dest: 'libs/less',
        options: {
          keepExpandedHierarchy: false,
          expand: false
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/upload.min.js': ['src/upload.js']
        },
        options: {
          mangle: false
        }
      }
    },
    clean: {
      temp: {
        src: ['tmp']
      },
      libs: {
        src: ['libs']
      }
    },

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js', 'tmp/*.js'],
        dest: 'dist/upload.js'
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js']
    },

    connect: {
      server: {
        options: {
          hostname: 'localhost',
          port: 8085
        }
      }
    },

    watch: {
      dev: {
        files: ['Gruntfile.js', 'upload.js', 'index.html'],
        tasks: ['sass', 'concat:dist',

        ],
        options: {
          atBegin: true,
          livereload: true
        }
      },
      docs: {
        files: ['Gruntfile.js', 'app/Http/Controllers/*.php'],
        tasks: ['apidoc'],
        options: {
          atBegin: true,
          livereload: true
        }
      },
      min: {
        files: ['Gruntfile.js', 'upload.js', '*.html'],
        tasks: ['jshint', 'concat:dist',
          'clean:temp', 'uglify:dist'
        ],
        options: {
          atBegin: true
        }
      }
    },

    compress: {
      dist: {
        options: {
          archive: 'dist/<%= pkg.name %>-<%= pkg.version %>.zip'
        },
        files: [{
          src: ['index.html'],
          dest: '/'
        }, {
          src: ['dist/**'],
          dest: 'dist/'
        }, {
          src: ['assets/**'],
          dest: 'assets/'
        }, {
          src: ['libs/**'],
          dest: 'libs/'
        }]
      }
    },
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/sass',
          src: ['styles.scss'],
          dest: 'dist/',
          ext: '.css'
        }]
      }
    },
    reload: {
      proxy: {
        host: 'localhost',
      }
    },
    karma: {
      options: {
        configFile: 'config/karma.conf.js'
      },
      unit: {
        singleRun: true
      },

      continuous: {
        singleRun: false,
        autoWatch: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-reload');

  grunt.registerTask('contribute', ['connect:server', 'watch:min',
    'bower:dev'
  ]);
  grunt.registerTask('code', ['connect:server', 'watch:dev']);

  grunt.registerTask('test', ['bower', 'jshint', 'karma:continuous']);
  grunt.registerTask('minified', ['bower', 'connect:server', 'watch:min']);
  grunt.registerTask('package', ['bower', 'concat:dist',
    'uglify:dist',
    'clean:temp', 'compress:dist'
  ]);
};
