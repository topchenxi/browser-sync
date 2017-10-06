// css 构建
const
    gulp = require('gulp'),
    // 自动同步浏览器插件
    autoprefixer = require('gulp-autoprefixer'),
    // less 插件
    less = require('gulp-less'),
    // 抛出异常 且 不终止watch事件
    plumber = require('gulp-plumber'),
    // 错误提示
    notify = require('gulp-notify'),
    // MD5戳
    rev = require('gulp-rev'),
    // 合并
    concat = require('gulp-concat'),
    // 压缩
    cssnano = require('cssnano'),
    // postcss 插件
    postcss = require('gulp-postcss'),
    // 重命名
    rename = require('gulp-rename');

module.exports = () => {
    return gulp.src(['static/less/*.less'])
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(less())
        .pipe(autoprefixer({
            browsers: [
                'last 4 versions',
                '> 1%',
                'opera 12.1',
                'bb 10',
                'android 4'
            ]
        }))
        .pipe(concat('app.css'))
        .pipe(postcss([
            cssnano({ reduceIdents: { keyframes: false } })
        ]))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/rev/css'))
        .on('end', () => {
            console.log('Build css successfully');
        });
};