module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'src/graph.js', 'src/layouts/*.js', 'src/utils/Label.js', 'src/utils/ObjectSelection.js']
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
      },
      graphVisualization: {
        files: {
          'build/graph.min.js': ['webgl-frameworks/three.min.js', 'src/graph.js', 'src/utils/*.js', 'src/layouts/*.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jshint', 'uglify']);
};
