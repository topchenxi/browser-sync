 const    
     gulp = require('gulp'),
     minifyCSS = require('gulp-minify-css'),
     uglify = require('gulp-uglify'),
     sass = require('gulp-sass'),
     imagemin = require('gulp-imagemin'),
     imageminJpegRecompress = require('imagemin-jpeg-recompress'),
     imageminOptipng = require('imagemin-optipng'),
     browserSync = require('browser-sync').create();

 const    
     srcScript = '../src/js/*.js',
     dstScript = '../dist/js',
     srcCss = '../src/css/*.css',
     dstCSS = '../dist/css',
     srcSass = '../src/css/*.scss',
     dstSass = '../dist/css',
     srcImage = '../src/img/*.*',
     dstImage = '../dist/img',
     srcHtml = '../src/*.html',
     dstHtml = '../dist';

 gulp.task('script', () => {
     return gulp.src(srcScript).pipe(uglify()).pipe(gulp.dest(dstScript));
 });
 gulp.task('css', () => {
     return gulp.src(srcCss).pipe(minifyCSS()).pipe(gulp.dest(dstCSS));
 });
 gulp.task('sass', () => {
     return gulp.src(srcSass).pipe(sass({  
         outputStyle: 'compressed'
     })).pipe(gulp.dest(dstSass));
 });
 gulp.task('imgmin', () => {    
     var jpgmin = imageminJpegRecompress({
             accurate: true,
             quality: "high",
             method: "smallfry",
             min: 70,
             loops: 0,
             progressive: false,
             subsample: "default"
         }),
         pngmin = imageminOptipng({
             optimizationLevel: 4
         });    
     return gulp.src(srcImage).pipe(imagemin({
         use: [jpgmin, pngmin]
     })).pipe(gulp.dest(dstImage));
 });
 gulp.task('html', () => {    
     return gulp.src(srcHtml).pipe(gulp.dest(dstHtml));
 });
 gulp.task('server', () => {    
     browserSync.init({
         server: "../dist"    
     });
 });
 gulp.task('auto', () => {    
     gulp.watch(srcScript, ['script']);    
     gulp.watch(srcCss, ['css']);    
     gulp.watch(srcSass, ['sass']);    
     gulp.watch(srcImage, ['imgmin']);    
     gulp.watch(srcHtml, ['html']);    
     gulp.watch('../dist/**/*.*').on('change', browserSync.reload);
 });
 gulp.task('default', ['script', 'css', 'sass', 'imgmin', 'html', 'server', 'auto']);