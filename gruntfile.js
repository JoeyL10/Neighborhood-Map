

module.exports = function(grunt) {

grunt.initConfig({
  imagemin: {                          // Task        
      options: {
        progressive: true,                       // Target options
        optimizationLevel: 7
        
      },
   
      dist: {                // Another target
      files: [{
        expand: true,                  // Enable dynamic expansion
        cwd: 'srcimages/',                   // Src matches are relative to this path
        src: ['**/*.{png,jpg}'],   // Actual patterns to match
        dest: 'images/'                // Destination path prefix
      }]
    }
  }

});


  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.registerTask('default', ['imagemin']);
   

};