const
    // 基础库
    gulp = require('gulp'),
    // CSS预处理/Sass编译
    sass = require('gulp-ruby-sass'),
    // JS文件压缩
    uglify = require('gulp-uglify'),
    // imagemin 图片压缩
    imagemin = require('gulp-imagemin'),
    // imagemin 深度压缩
    pngquant = require('imagemin-pngquant'),
    // 网页自动刷新（服务器控制客户端同步刷新）
    livereload = require('gulp-livereload'),
    // 本地服务器
    webserver = require('gulp-webserver'),
    // 文件重命名
    rename = require('gulp-rename'),
    // 来源地图
    sourcemaps = require('gulp-sourcemaps'),
    // 只操作有过修改的文件
    changed = require('gulp-changed'),
    // 文件合并
    concat = require("gulp-concat"),
    // 文件清理
    clean = require('gulp-clean');

var srcPath = {
    html: 'src',
    css: 'src/scss',
    script: 'src/js',
    image: 'src/images'
};
var destPath = {
    html: 'dist',
    css: 'dist/css',
    script: 'dist/js',
    image: 'dist/images'
};


// HTML处理
gulp.task('html', () =>
    gulp.src(srcPath.html + '/**/*.html')
    .pipe(changed(destPath.html))
    .pipe(gulp.dest(destPath.html))
);

// 样式处理
gulp.task('sass', () => {
    // 指明源文件路径、并进行文件匹配（编译风格：简洁格式）
    return sass(srcPath.css, {
            style: 'compact',
            sourcemap: true
        })
        .on('error', (err) => {
            // 显示错误信息
            console.error('Error!', err.message);
        })
        // 地图输出路径（存放位置）
        .pipe(sourcemaps.write('maps'))
        // 输出路径
        .pipe(gulp.dest(destPath.css));
});

// JS文件压缩&重命名
gulp.task('script', () => {
    // 指明源文件路径、并进行文件匹配，排除 .min.js 后缀的文件
    return gulp.src([srcPath.script + '/*.js', '!' + srcPath.script + '/*.min.js'])
        // 对应匹配的文件
        .pipe(changed(destPath.script))
        // 执行sourcemaps
        .pipe(sourcemaps.init())
        // 重命名
        .pipe(rename({
            suffix: '.min'
        }))
        // 使用uglify进行压缩，并保留部分注释
        .pipe(uglify({
            preserveComments: 'some'
        }))
        // 地图输出路径（存放位置）
        .pipe(sourcemaps.write('maps'))
        // 输出路径
        .pipe(gulp.dest(destPath.script));
});

// imagemin 图片压缩
gulp.task('images', () => {
    // 指明源文件路径，如需匹配指定格式的文件，可以写成 .{png,jpg,gif,svg}
    return gulp.src(srcPath.image + '/**/*')
        .pipe(changed(destPath.image))
        .pipe(imagemin({
            // 无损压缩JPG图片
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            // 不要移除svg的viewbox属性
            use: [pngquant()]
            // 深度压缩PNG
        }))
        .pipe(gulp.dest(destPath.image));
    // 输出路径
});

// 文件合并
gulp.task('concat', () => {
    // 要合并的文件
    return gulp.src(srcPath.script + '/*.min.js')
        // 合并成libs.js
        .pipe(concat('libs.js'))
        // 重命名
        .pipe(rename({
            suffix: '.min'
        }))
        // 输出路径
        .pipe(gulp.dest(destPath.script));
});

// 本地服务器
gulp.task('webserver', () => {
    gulp.src(destPath.html)
        // 服务器目录（.代表根目录）
        .pipe(webserver({
            // 运行gulp-webserver
            livereload: true,
            // 启用LiveReload
            open: true
            // 服务器启动时自动打开网页
        }));
});

// 监听任务
gulp.task('watch', () => {
    // 监听 html
    gulp.watch(srcPath.html + '/**/*.html', ['html'])
    // 监听 scss
    gulp.watch(srcPath.css + '/*.scss', ['sass']);
    // 监听 images
    gulp.watch(srcPath.image + '/**/*', ['images']);
    // 监听 js
    gulp.watch([srcPath.script + '/*.js', '!' + srcPath.script + '/*.min.js'], ['script']);
});

// 默认任务
gulp.task('default', ['webserver', 'watch']);

// 清理文件
gulp.task('clean', () => {
    // 清理maps文件
    return gulp.src([destPath.css + '/maps', destPath.script + '/maps'], {
            read: false
        })
        .pipe(clean());
});


// 样式处理
gulp.task('sassRelease', () => {
    // 指明源文件路径、并进行文件匹配（编译风格：压缩）
    return sass(srcPath.css, {
            style: 'compressed'
        })
        .on('error', (err) => {
            // 显示错误信息
            console.error('Error!', err.message);
        })
        // 输出路径
        .pipe(gulp.dest(destPath.css));
});


// 脚本压缩&重命名
gulp.task('scriptRelease', () => {
    // 指明源文件路径、并进行文件匹配，排除 .min.js 后缀的文件
    return gulp.src([srcPath.script + '/*.js', '!' + srcPath.script + '/*.min.js'])
        // 重命名
        .pipe(rename({
            suffix: '.min'
        }))
        // 使用uglify进行压缩，并保留部分注释
        .pipe(uglify({
            preserveComments: 'some'
        }))
        // 输出路径
        .pipe(gulp.dest(destPath.script));
});

// 打包发布
gulp.task('release', ['clean'], () => {
    // 开始任务前会先执行[clean]任务
    return gulp.start('sassRelease', 'scriptRelease', 'images');
    // 等[clean]任务执行完毕后再执行其他任务
});