var gulp = require('gulp');
// 自动同步浏览器插件
var browserSync = require('browser-sync').create();
// 使gulp任务相互独立,解除任务间的依赖,增强task复用
var runSequence = require('run-sequence');

// 创建同步浏览器任务
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
});

// 创建监听任务
gulp.task('watch', ['browserSync'], function() {
    gulp.watch('./static/**/*.css', browserSync.reload);
    gulp.watch('./static/**/*.js', browserSync.reload);
    gulp.watch('./views/**/*.html', browserSync.reload);
    gulp.watch('index.html', browserSync.reload);
});

// 创建默认任务

// gulp.task('default', function(callback) {
//     runSequence(['browserSync', 'watch'], callback);
// });

gulp.task('default', ['watch'], function(callback) {});