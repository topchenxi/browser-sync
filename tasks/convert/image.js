const
    gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    imageminPngquant = require('imagemin-pngquant'),
    plumber = require('gulp-plumber');

module.exports = () => {
    gulp.src(['static/images/*.+(png|jpg|gif|svg)', 'static/images/**/*.+(png|jpg|gif|svg)'])
        .pipe(plumber())
        .pipe(imagemin({
            // true 深度压缩图片 false 无损压缩jpg图片
            progressive: true,
            //不要移除svg的viewbox属性
            svgoPlugins: [{ removeViewBox: false }],
            //使用pngquant深度压缩png图片的imagemin插件
            use: [imageminPngquant({ quality: '65-80' })]
        }))
        .pipe(gulp.dest('dist/images'))
        .on('end', () => {
            console.log('Min images successfully');
        });
}