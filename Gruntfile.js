module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'Graph.js', 'drawings/*.js', 'layouts/*.js', 'utils/Label.js', 'utils/ObjectSelection.js']
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
      },
      graphVisualization: {
        files: {
          'build/graph.min.js': ['Graph.js', 'webgl-frameworks/three.min.js', 'utils/*.js', 'layouts/*.js', 'drawings/*.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jshint', 'uglify']);
};
