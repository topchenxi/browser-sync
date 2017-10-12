const
    gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    less = require('gulp-less'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps');

module.exports = lessTask = () => {
    return gulp.src(['./static/less/*.less', './static/less/**/*.less'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write({ includeContent: false }))
        .pipe(autoprefixer({
            browsers: [
                'last 4 versions',
                '> 1%',
                'opera 12.1',
                'bb 10',
                'android 4'
            ]
        }))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest('dist/css'))
        .on('end', () => {
            console.log('Build less successfully');
        });
}