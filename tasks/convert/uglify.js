const gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rev = require('gulp-rev'),
    plumber = require('gulp-plumber');

module.exports = () => {
    return gulp.src(['static/js/*.js', 'static/js/**/*.js'])
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
        .pipe(rev())
        .pipe(gulp.dest('./dist/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./dist/rev/js'))
}