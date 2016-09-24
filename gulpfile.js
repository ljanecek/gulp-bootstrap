//
// Variables
// ------------------------------

var env = process.env.NODE_ENV || 'local';

var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('babelify');
var gulpif = require('gulp-if');
var pixrem = require('gulp-pixrem');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var minifycss = require('gulp-clean-css');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var inlineimage = require('gulp-inline-image');
var autoprefixer = require('gulp-autoprefixer');
var moduleImporter = require('sass-module-importer');


//
// Paths
// ------------------------------

var paths = {
    src: {
        styles: './src/scss/application.scss',
        scripts: './src/js/application.js'
    },
    watch: {
        styles: './src/scss/**/*.scss',
        scripts: './src/js/**/*.js'
    },
    dist: {
        styles: './dist/css',
        scripts: './dist/js'
    }
};


//
// Watcher
// ------------------------------

gulp.task('watch', function() {
    gulp.watch(paths.watch.scripts, { interval: 500 }, ['scripts']);
	gulp.watch(paths.watch.styles, { interval: 500 }, ['styles']);
});


//
// Tasks
// ------------------------------


gulp.task('styles', function() {
    gulp.src(paths.src.styles)
        .pipe(gulpif(env == 'local', sourcemaps.init()))
        .pipe(sass({
            importer: moduleImporter()
        }).on('error', sass.logError))
		.pipe(pixrem({
			rootValue: '62.5%',
			atrules: true
	    }))
        .pipe(autoprefixer({
            browsers: ['> 2%', 'IE 8'],
            cascade: false
        }))
        .pipe(inlineimage())
        .pipe(gulpif(env != 'local', minifycss({
            compatibility: 'ie8'
        })))
    	.pipe(gulpif(env == 'local', sourcemaps.write()))
        .pipe(gulp.dest(paths.dist.styles));
});


gulp.task('scripts', function() {

    browserify(paths.src.scripts, {
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
		.on('error', function(e) {
            console.error(e);
            this.emit('end');
        })
        .pipe(gulpif(env != 'local', uglify()))
        .on('error', function(e) {
            console.error(e);
            this.emit('end');
        })
        .pipe(gulp.dest('./dist/js'));

});


//
// Default task & Run
// ------------------------------

gulp.task('default', ['watch', 'scripts', 'styles']);
