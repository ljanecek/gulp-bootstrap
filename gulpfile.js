//
// Variables
// ------------------------------

var env = process.env.NODE_ENV || 'local';

var gulp = require('gulp');
var browserify = require('browserify');
var babel = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');


gulp.task('scripts', function() {

    browserify('./src/js/application.js', {
            debug: true
        })
        .transform("babelify", {
            global: true,
			sourceMaps: false,
            ignore: './node_modules/jquery'
        })
        .bundle()
        .pipe(source('application.js'))
        .pipe(buffer())
        .on('error', function(err) {
            console.error(err);
            this.emit('end');
        })
        .pipe(gulp.dest('./dist/js'));

});

//
// Default task & Run
// ------------------------------

gulp.task('default', ['scripts']);
