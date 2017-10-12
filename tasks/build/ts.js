const
    gulp = require('gulp'),
    ts = require('gulp-typescript'),
    config = ts.createProject('tsconfig.json'),
    plumber = require('gulp-plumber');

module.exports = () => {
    return gulp.src(['static/*.ts', 'static/**/*.ts'])
        .pipe(plumber())
        // .pipe(ts(config))
        .pipe(config())
        .pipe(gulp.dest('dist'));
}