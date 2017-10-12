const
    gulp = require('gulp'),
    babel = require('gulp-babel'),
    plumber = require('gulp-plumber');

module.exports = () => {
    return gulp.src(['static/js/*.js', 'static/js/**/*.js'])
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/js'))
}