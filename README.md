# gulp-vows

A basic gulp plugin for vows.js, leaning on vows's test runner.

## Options

gulp-vows takes an options object with the following options

### options.runner
*String*: Name of vows's custom reporters. One of:
- **dot-matrix** (default)
- **spec**
- **json**
- **tap**
- **slient**
- **reporter**:

### options.shuffle
*boolean*: Shuffle order of test suites.

### options.verbose
*boolean*: Verbose output. (unstable)

### options.coverage
@todo: to be implemented

### options.parallel
@todo: to be implemented (launch suites in parallel, at the cost of reporting results)

## Example
```js
gulp.task('task', function(){
  return gulp.src('test/**/*.spec.js')
      .pipe(vows({reporter: 'spec'}));
});
```
## Todos
Proper testing, documentation, aforementioned features

## License
MIT
