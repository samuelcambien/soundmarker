module.exports = function (grunt) {

  grunt.initConfig({
    browserify: {
      dist: {
        files: {
          'build/module.js': ['node_modules/**/*.coffee']
        },
        options: {
          transform: ['coffeeify']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['browserify']);
};
