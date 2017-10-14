const
    gulp = require('gulp'),
    // sass 插件
    sass = require('gulp-sass'),
    // 自动同步浏览器插件
    browserSync = require('browser-sync'),
    // 合并文件的插件
    useref = require('gulp-useref'),
    // 压缩js插件
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    // 压缩css插件
    cssnano = require('gulp-cssnano'),
    // 压缩图片插件
    imagemin = require('gulp-imagemin'),
    // 压缩png图片的插件
    pngquant = require('imagemin-pngquant'),
    // 缓存插件，可以加快编译速度
    cache = require('gulp-cache'),
    // 删除文件插件
    del = require('del'),
    // 同步运行任务插件
    runSequence = require('run-sequence'),
    // 给css3属性添加浏览器前缀插件
    autoprefixer = require('gulp-autoprefixer'),
    // sourcemap 插件
    sourcemaps = require('gulp-sourcemaps'),
    lazypipe = require('lazypipe'),
    // 合成sprite图片插件
    spritesmith = require('gulp.spritesmith'),
    imageminOptipng = require('imagemin-optipng');


// 编译sass文件，添加css3属性浏览器前缀，reload 浏览器
gulp.task('sass', () => {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('./src/css'))
        .pipe(browserSync.reload({ stream: true }));
});
// 自动更新浏览器任务
gulp.task('browserSync', () => {
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    })
});
// 合并文件任务
// 在html设置需要合并的文件：
//  <!--build:js js/flexible.min.js -->
//      <script src="js/flexible_css.js"></script>
//      <script src="js/flexible.js"></script>
//  <!-- endbuild-->
// 执行任务后，会编译成 ： <script src="js/flexible.min.js"></script>
// 同时会把 flexible_css.js 和 flexible.js 合并成 flexible.min.js
gulp.task('useref', () => {
    return gulp.src('./src/*.html')
        .pipe(useref({}, lazypipe().pipe(sourcemaps.init, { loadMaps: true })))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist'));
});
// 图片压缩任务
gulp.task('images', () => {
    return gulp.src('./src/img/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/img'));
});
// 合并sprite图任务
gulp.task('sprite', () => {
    var spriteData = gulp.src('./src/img/sprite/**/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.scss',
            imgPath: '../img/sprite/sprite.png',
            cssFormat: 'scss',
            padding: 10
        }));
    return spriteData.pipe(gulp.dest('./src/img/sprite/'))
});
// 删除build目录
gulp.task('clean:dist', () => {
    return del.sync('dist');
});
// 清除缓存
gulp.task('cache:clear', (cb) => {
    return cache.clearAll(cb)
});
// 监控任务，当有sass文件，html文件，js文件改动的时候，刷新浏览器
gulp.task('watch', ['browserSync', 'sass'], () => {
    gulp.watch('./src/scss/**/*.scss', ['sass']);
    gulp.watch('./src/*.html', browserSync.reload);
    gulp.watch('./src/js/**/*.js', browserSync.reload);
});
// 构建最终输出文件
gulp.task('build', (callback) => {
    runSequence('clean:dist', ['sass', 'useref', 'images', 'fonts'], callback);
});
// gulp 默认执行任务
gulp.task('default', (callback) => {
    runSequence(['sass', 'browserSync', 'watch'], callback);
});