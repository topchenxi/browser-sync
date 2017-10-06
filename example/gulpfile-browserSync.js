const gulp = require('gulp'),
    babel = require('gulp-babel'),
    stylus = require('gulp-stylus'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer');
    
gulp.task('stylus', () => {
    return gulp.src(['./static/stylus/*.styl', './static/stylus/**/*.styl'])
        .pipe(stylus())
        .pipe(autoprefixer({
            browsers: [
                'last 4 versions'
            ]
        }))
        .pipe(gulp.dest('dist/css/'))
        .on('end', () => {
            console.log('Build stylus successfully');
        })
        .pipe(browserSync.reload({
            stream: true
        }));
});
gulp.task('babel', () => {
    return gulp.src(['static/js/*.js', 'static/js/**/*.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/js/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('browserSync', () => {
    browserSync({
        server: {
            baseDir: '.'
        }
    })
});
gulp.task('watch', ['babel', 'browserSync', 'stylus'], function() {
    gulp.watch('static/**/*.styl', ['stylus']);
    gulp.watch('static/**/*.js', ['babel']);
    gulp.watch('*.html', browserSync.reload);
});