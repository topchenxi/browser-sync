const
    gulp = require('gulp'),
    base64 = require('gulp-base64'),
    plumber = require('gulp-plumber');

module.exports = () => {
    return gulp.src(['static/css/cssnano/*.css', 'static/css/cssnano/**/*.css'])
        .pipe(plumber())
        .pipe(base64({
            baseDir: 'static/images',
            extensions: ['png', 'jpg'],
            maxImageSize: 20000 * 1024,
            debug: false
        }))
        .pipe(gulp.dest('dist/css/base64'))
        .on('end', () => {
            console.log('base64 images successfully');
        });
}