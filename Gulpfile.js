var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var uglify = require('gulp-uglify');

function compile(watch) {
	var bundler = watchify(browserify('./src/app.js', { debug: true }).transform(babel));

	function rebundle() {
		bundler.bundle()
			.on('error', function(err) {
				console.error(err);
				this.emit('end');
			})
			.pipe(source('build.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({ loadMaps: true }))
			.pipe(uglify())
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('./build'));
	}

	if (watch) {
		bundler.on('update', function() {
			console.log('-> bundling...');
			rebundle();
		});
	}

	rebundle();
}

gulp.task('build', function() { return compile(false); });
gulp.task('watch', function() { return compile(true); });

gulp.task('default', ['watch']);