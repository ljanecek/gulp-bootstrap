//
// Variables
// ------------------------------

var env = process.env.NODE_ENV || 'local';

var gulp = require('gulp');
var babel = require('babelify');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var source = require('vinyl-source-stream');


//
// Watcher
// ------------------------------

gulp.task('watch', function() {
    gulp.watch('src/js/**/*.*', { interval: 500 }, ['scripts']);
});


//
// Tasks
// ------------------------------

gulp.task('scripts', function() {

    browserify('./src/js/application.js', {
            debug: true
        })
		/*
			ECMA6
			http://babeljs.io/docs/plugins/preset-es2015/
			https://github.com/babel/babelify#faq
		*/
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

gulp.task('default', ['watch', 'scripts']);
