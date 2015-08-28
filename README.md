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

### options.errorOnFailedTests
*boolean*: Throw an error if any tests fail

### options.coverage
@todo: to be implemented

### options.parallel
@todo: to be implemented (launch suites in parallel, at the cost of reporting results)

## Example
Gulp task
```js
gulp.task('task', function(){
  return gulp.src('test/**/*.spec.js')
      .pipe(vows({reporter: 'spec'}));
});
```
Test suite (export test suite)
```js
var vows = require('vows'),
  assert = require('assert');
vows.describe('A good suite').addBatch({
  'when all contexts': {
    topic: function() {return true;},
    'are valid': {
      assert.equal(topic, true);
    }
  }
}).export(module);
```

## Todos
Proper testing, documentation, aforementioned features

## License
MIT
