const
    gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    stylus = require('gulp-stylus');

module.exports = () => {
    return gulp.src(['./static/stylus/*.styl', './static/stylus/**/*.styl'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(stylus())
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
            console.log('Build stylus successfully');
        });
};