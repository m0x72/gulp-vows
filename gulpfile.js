var gulp = require('gulp');
var vows = require('./index.js');
var shell = require('gulp-shell');

// define tasks here
gulp.task('jsonApiTest', function(){
  return gulp.src('test/json/**/*.spec.js')
      .pipe(vows({reporter: 'spec'}))
      .pipe(shell(["echo stream is fine"]));
});
