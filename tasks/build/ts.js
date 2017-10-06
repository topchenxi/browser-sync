const gulp = require('gulp');
const ts = require('gulp-typescript');
const config = ts.createProject('tsconfig.json');
const plumber = require('gulp-plumber');

module.exports = () => {
    return gulp.src(['static/*.ts', 'static/**/*.ts'])
        .pipe(plumber())
        // .pipe(ts(config))
        .pipe(config())
        .pipe(gulp.dest('dist'));
}