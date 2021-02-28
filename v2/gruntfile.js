
module.exports =  function (grunt) {

  const sass = require('node-sass');
  
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Define reusable paths.
    paths: {
      dist: '../',
      src: 'src',
      dist_css: '<%= paths.dist %>/css',
      dist_js: '<%= paths.dist %>/js',
      src_scss: '<%= paths.src %>/scss',
      src_pug: '<%= paths.src %>/templates',
      src_js: '<%= paths.src %>/js',
      src_css_vendor: '<%= paths.src %>/vendor/css',
      src_js_vendor: '<%= paths.src %>/vendor/js',
      bootstrap_scss: '<%= paths.src %>/vendor/bootstrap'
    },

    // Sass compiling.
    sass: {
      expanded: {
        options: {
          implementation: sass,
          outputStyle: 'expanded',
          sourceMap: false
        },
        files: {
          '<%= paths.dist_css %>/styles.css': '<%= paths.src_scss %>/styles.scss'
        }
      },
      minified: {
        options: {
          implementation: sass,
          outputStyle: 'compressed',
          sourceMap: true
        },
        files: {
          '<%= paths.dist_css %>/styles.min.css': '<%= paths.src_scss %>/styles.scss'
        }
      },
      bootstrap: {
        options: {
          implementation: sass,
          outputStyle: 'compressed',
          sourceMap: false
        },
        files: {
          '<%= paths.src_css_vendor %>/bootstrap.min.css': '<%= paths.bootstrap_scss %>/bootstrap.scss'
        }
      }
    },

    // Compile only changed Pug file
    'cache-pug-compiler': {
      cache: {
        options: {
          // Will hook into this pug tasks and replace the src, 
          // changing what gets compiled 
          pugTask: 'compile',
          // Used by pugInheritance 
          basedir: '<%= paths.src_pug %>',
        },
        files: [{
          expand: true,
          cwd: '<%= paths.src_pug %>',
          src: ['*.pug',  'serial/*.pug', 'sketch-book/*.pug', 'paintings/*.pug'],
          dest: '<%= paths.dist %>',
          ext: '.html'
        }]
      }
    },

    // Pug (Jade) compiling.
    pug: {
      compile: {
        options: {
          pretty: true
        },
        files: [{
          cwd: '<%= paths.src_pug %>',
          src: ['*.pug', 'serial/*.pug', 'sketch-book/*.pug', 'paintings/*.pug'],
          dest: '<%= paths.dist %>',
          expand: true,
          ext: '.html'
        }]
      }
    },

    // Browser autorefresh / syncing.
    browserSync: {
      files: {
        src: ['<%= paths.dist %>/**/*.html', '<%= paths.dist_css %>/*.css', '<%= paths.dist_js %>/*.js']
      },
      options: {
        browser: 'google chrome',
        server: '<%= paths.dist %>',
        open: false,
        watchTask: true
      }
    },

    // Concat. Files concatination
    concat: {
      css: {
        src: '<%= paths.src_css_vendor %>/*.css',
        dest: '<%= paths.dist_css %>/vendor.min.css'
      },
      js: {
        src: ['<%= paths.src_js_vendor %>/jquery.min.js', '<%= paths.src_js_vendor %>/popper.min.js', '<%= paths.src_js_vendor %>/photoswipe.min.js', '<%= paths.src_js_vendor %>/*.js'],
        dest: '<%= paths.dist_js %>/vendor.min.js'
      }
    },

    // Uglify. Files minification
    uglify: {
      main_js: {
        files: {
          '<%= paths.dist_js %>/main.min.js': '<%= paths.src_js %>/main.js'
        }
      }
    },

    // Watcher.
    watch: {
      css: {
        files: ['<%= paths.src_scss %>/**/*.scss'],
        tasks: ['sass:expanded']
      },
      'cache-pug-compiler': {
        files: ['<%= paths.src_pug %>/**/*.pug'],
        tasks: ['cache-pug-compiler', 'pug']
      },
      pug: {
        files: ['<%= paths.src_pug %>/helpers/*.pug', '<%= paths.src_pug %>/partials/*.pug'],
        tasks: ['pug']
      },
      js: {
        files: ['<%= paths.src_js %>/*.js'],
        tasks: ['uglify']
      }
    }

  });

  // These plugins provide necessary tasks.

  // BrowserSync.
  grunt.loadNpmTasks('grunt-browser-sync');

  // Sass.
  grunt.loadNpmTasks('grunt-sass');

  // Compile only changed Pug file
  grunt.loadNpmTasks('grunt-cache-pug-compile');

  // Pug (formerly Jade).
  grunt.loadNpmTasks('grunt-contrib-pug');

  // Concat.
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Uglify.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Watch.
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Run tasks.

  // Default task.
  grunt.registerTask('default', ['browserSync', 'sass:expanded', 'concat', 'uglify', 'pug', 'watch']);
};