var gulp = require('gulp');
var markdown = require('gulp-markdown');


module.exports = () => {
    return gulp.src(['*.md', 'static/**/*.md'])
        .pipe(markdown())
        .pipe(gulp.dest('dist'));
}