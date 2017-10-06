const gulp = require('gulp'),
    revCollector = require('gulp-rev-collector');
module.exports = () => {
    return gulp.src(['dist/rev/**/*.json', 'static/html/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('./dist/html'));
};