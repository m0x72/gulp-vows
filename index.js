// gulp-vows

// imports
var through = require('through2');
var _ = require('lodash');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var path = require('path');
var _Module = require('module'); // module prototype

// constants
const PLUGIN_NAME = 'gulp-vows';

// (default) plugin arguments
var args = {
  reporter: require('vows/lib/vows/reporters/dot-matrix'),
  verbose: false,
  errorOnFailedTests: false,
  shuffle: false
};


// helper
function requireFromString(src, filename) {
  var m = new _Module(filename, this);
  m.filename = filename;
  m.paths = _Module._nodeModulePaths(path.dirname(filename));
  // m.paths = module.paths;
  m._compile(src, filename);
  return m.exports;
}

function parseArguments(_args) {
  if (typeof _args !== "object")
    return;

  // reporter
  if (typeof _args.reporter === "string") {
    switch (_args.reporter) {
      case 'dot-matrix':
        args.reporter = require('vows/lib/vows/reporters/dot-matrix');
        break;
      case 'spec':
        args.reporter = require('vows/lib/vows/reporters/spec');
        break;
      case 'tap':
        args.reporter = require('vows/lib/vows/reporters/tap');
        break;
      case 'json':
        args.reporter = require('vows/lib/vows/reporters/json');
        break;
      case 'silent':
        args.reporter = require('vows/lib/vows/reporters/silent');
        break;
      default:
        // already set
        // args.reporter = require('vows/lib/vows/reporters/dot-matrix');
        break;
    }
  }

  // verbose
  if (typeof _args.verbose === "boolean")
    args.verbose = _args.verbose;

  if (typeof _args.shuffle === "boolean")
    args.shuffle = _args.shuffle;

  if (typeof _args.errorOnFailedTests === "boolean")
    args.errorOnFailedTests = _args.errorOnFailedTests;

  // // nocolor
  // if (typeof _args.nocolor === "boolean")
  //   args.nocolor = _args.nocolor;

  // @TODO: jscoverage

}

function getReporterWrapper() {
  // reporterWrapper for suite.run() from args.reporter
  return  {
    name: args.reporter.name,
    print: args.reporter.print,
    reset: function() {
      args.reporter.reset && args.reporter.reset();
    },
    report: function (data, filename) {
      switch (data[0]) {
        case 'subject':
        case 'vow':
        case 'context':
        case 'error':
          args.reporter.report(data, filename);
          break;
        case 'end':
          (args.verbose || args.reporter.name === 'json') &&
          args.reporter.report(data);
          break;
        case 'finish':
          args.verbose ? args.reporter.print('\n') : args.reporter.print(' ');
          break;
      }
    }
  };
}

// main plugin
function gulpVows(gOptions) {

  // vow suite collection
  var suites =[];
  // results (accumulation object for final results)
  var results = {
      honored: 0,
      broken:  0,
      errored: 0,
      pending: 0,
      total:   0,
      time:    0
  };

  // parse passed arguments
  parseArguments(gOptions);

  // return (vinyl file) stream to gulp
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
       // do nothing if no contents
       return cb(null, file);
    }

    if (file.isStream()) {
        return cb(new gutil.PluginError('gulp-vow', 'Streaming not supported'));
    }


    if (file.isBuffer()) {
        // Load spec
        try {
          var suitesFromFile = requireFromString(String(file.contents), file.path/*file.relative*/);
        } catch(e) {
          return cb(new gutil.PluginError('gulp-vow', e));
        }

        // add suite to collection
        suites = suites.concat(Object.keys(suitesFromFile).map(function(suiteName){
          //change suite._filename (as in vows/bin/vows)
          suitesFromFile[suiteName]._filename = file.relative;
          return suitesFromFile[suiteName];
        }));

    }

    this.push(file);

    return cb();
  }, function(cb) {
    // launch collection of suites

    var that = this;

    // suite options object
    var options = {
      reporter: getReporterWrapper(),
      verbose: args.verbose // not sure if used
    };

    // prepare reporter
    options.reporter.reset();

    // suffle if shuffle arg set
    if (args.shuffle)
      suites = _.shuffle(suites);

    // run suites!
    run(suites, reportResults);

    // runs test suites synchronously, eventually calls reportResults to end stream
    // @TODO supply arg to launch all suites at once at the cost of report prettiness
    function run(suites, callback) {
        var suite = suites.shift();
        if (suite) {
            suite.run(options, function (result) {
                Object.keys(result).forEach(function (k) {
                    results[k] += result[k];
                });
                run(suites, callback);
            });
        } else {
            callback(results);
        }
    }

    // reports results and calls flush callback (called by runner)
    function reportResults(results){
      var status = results.errored ? 2 : (results.broken ? 1 : 0);

      // !options.verbose && args.reporter.print('\n');
      // msg('runner', 'finish');
      args.reporter.report(['finish', results], {
          write: function (str) {
              process.stdout.write(str.replace(/^\n\n/, '\n'));
          }
      });

      // @TODO: implement coverage intstrumentation

      // try {
      //     if (options.coverage === true && _$jscoverage !== undefined) {
      //         _coverage.report(_$jscoverage);
      //     }
      // } catch (err) {
      //     // ignore the undefined jscoverage
      // }

      that.push();

      if(status > 0 && args.errorOnFailedTests) {
          return cb(new gutil.PluginError('gulp-vow', 'Tests failed'));
      }
      else {
          return cb();
      }
    }

  });

};

// exporting the plugin main function
module.exports = gulpVows;
