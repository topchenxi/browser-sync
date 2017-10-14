const gulp = require('gulp'),
    // 编译less
    less = require('gulp-less'),
    // 给css3属性添加浏览器前缀插件
    autoprefixer = require('gulp-autoprefixer'),
    // 删除文件插件
    del = require('del'),
    // 同步运行任务插件
    runSequence = require('run-sequence'),
    // 压缩js插件
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    sourcemaps = require('gulp-sourcemaps'),
    // 压缩图片插件
    imagemin = require('gulp-imagemin'),
    // 压缩png图片的插件
    pngquant = require('imagemin-pngquant'),
    // 合成sprite图片插件
    spritesmith = require('gulp.spritesmith');

// 清空数据
gulp.task('clean:dist', () => {
    return del.sync('dist');
});

// 编译less
gulp.task('buildCss', () => {
    gulp.src(['static/seller/less/**/*.less'])
        .pipe(less())
        .pipe(gulp.dest('dist/seller/css'))
    gulp.src(['static/ec/less/**/*.less'])
        .pipe(less())
        .pipe(gulp.dest('dist/ec/css'))
});

// 压缩js插件
gulp.task('buildJs', () => {
    return gulp.src(['static/seller/js/**/*.js'])
        .pipe(gulpIf('*.js', uglify()))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/seller/js'));
});
// 图片压缩任务
gulp.task('buildImages', () => {
    return gulp.src('static/seller/images/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/seller/images'));
});
// 合并sprite图任务
gulp.task('sprite', () => {
    const spriteData = gulp.src('static/seller/images/CCoin/*.png')
        .pipe(spritesmith({
            imgName: 'images/CCoin/sprite.png',
            cssName: 'less/CCoin/sprite.less',
            cssFormat: 'less',
            padding: 10
        }));
    return spriteData.pipe(gulp.dest('dist/seller'))
});
// 默认执行任务
gulp.task('default', (callback) => {
    runSequence(['clean:dist', 'buildCss', 'buildJs', 'buildImages', 'sprite'], callback);
})