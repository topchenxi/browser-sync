const cssnano = require('cssnano'),
    gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber');
    
module.exports = () => {
    return gulp.src(['./static/css/cssnano/*.css', './static/css/cssnano/**/*.css'])
        .pipe(plumber())
        .pipe(autoprefixer({
            browsers: [
                'last 4 versions',
                '> 1%',
                'opera 12.1',
                'bb 10',
                'android 4'
            ]
        }))
        .pipe(postcss([
            cssnano({ reduceIdents: { keyframes: false } })
        ]))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/css'));
}