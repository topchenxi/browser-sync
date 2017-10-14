let gulp = require('gulp'),
    less = require('gulp-less'),
    revHash = require('rev-hash'),
    through = require('through2'),
    fs = require("fs"),
    // 错误监听
    plumber = require('gulp-plumber'),
    // 压缩js插件
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    // 压缩css插件
    cssnano = require('gulp-cssnano'),
    // 同步运行任务插件
    runSequence = require('run-sequence'),
    // 给css3属性添加浏览器前缀插件
    autoprefixer = require('gulp-autoprefixer');

const staticEntry = 'static';

gulp.task('buildCSS', () => {
    const staticPath = `${staticEntry}/*`;
    return gulp.src(staticPath).pipe(through.obj((file, enc, callback) => {
        if (file.isDirectory() && file.relative != 'cfec') {
            let path = `${staticEntry}/${file.relative}/less`;
            gulp.src([`${path}/*.less`, `${path}/**/*.less`])
                .pipe(plumber())
                .pipe(less())
                .pipe(autoprefixer({
                    browsers: ['last 4 versions', '> 1%', 'opera 12.1', 'bb 10', 'android 4']
                }))
                .pipe(gulp.dest(`${staticEntry}/${file.relative}/css`))
        }
        callback();
    }))
})


gulp.task('compressFile', (callback) => {
    const staticPath = [`${staticEntry}/**/*.js`, `${staticEntry}/**/*.css`];
    return gulp.src(staticPath)
        .pipe(plumber())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
})

let text = '';

gulp.task('initMD5Content', () => {
    const staticPath = [`${staticEntry}/**/*.js`, `${staticEntry}/**/*.css`];
    return gulp.src(staticPath).pipe(through.obj((file, enc, callback) => {
        let filePath = file.relative;
        text += filePath.slice(0, filePath.lastIndexOf('.')).replace(/[\\\/\&\-\.]/g, '_') + '=' + revHash(file.contents) + '\n';
        callback();
    }))
})

gulp.task('buildMD5', ['initMD5Content'], () => {
    const filePath = '';
    fs.writeFile(`${filePath}filemd5.text`, text);
    fs.writeFile(`${filePath}filemd5.php`, '<?php\n' + text + '?>\n');
})


gulp.task('watch', () => {
    gulp.watch('static/**/*.less', ['buildCSS']);
})