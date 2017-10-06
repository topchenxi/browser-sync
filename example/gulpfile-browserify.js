const gulp = require('gulp'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream');

gulp.task('convertJS', function() {
    return gulp.src('static/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
})

gulp.task('convertCSS', function() {
    return gulp.src('static/css/*.css')
        .pipe(concat('static.css'))
        .pipe(cssnano())
        .pipe(rename(function(path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest('dist/css'));
})

gulp.task('watch', function() {
    gulp.watch('static/css/*.css', ['convertCSS']);
    gulp.watch('static/js/*.js', ['convertJS', 'browserify']);
})

// browserify
gulp.task("browserify", function() {
    var b = browserify({
        entries: "dist/js/app.js"
    });
    return b.bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("dist/js"));
});

gulp.task('start', ['convertJS', 'convertCSS', 'browserify', 'watch']);