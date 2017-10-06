const gulp = require('gulp'),
    rev = require('gulp-rev'),
    plumber = require('gulp-plumber');
    
module.exports = () => {
    return gulp.src(['./static/css/rev/*.css', './static/css/rev/**/*.css'])
        .pipe(plumber())
        .pipe(rev())
        .pipe(gulp.dest('./dist/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./dist/rev/css'));
};