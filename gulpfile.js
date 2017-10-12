// 路径
// 编译 转换 完整流程
const [BUILD_PATH, CONVERT_PATH, WHOLE_PATH] = ['./tasks/build/', './tasks/convert/', './tasks/whole/'];

// 插件
const [gulp, runSequence] = [require('gulp-help')(require('gulp')), require('run-sequence')];

// 任务
const
    cleanTask = require(BUILD_PATH + 'clean'),
    lessTask = require(BUILD_PATH + 'less'),
    scssTask = require(BUILD_PATH + 'scss'),
    stylusTask = require(BUILD_PATH + 'stylus'),
    es6Task = require(BUILD_PATH + 'es6'),
    tsTask = require(BUILD_PATH + 'ts'),
    mdTask = require(BUILD_PATH + 'md'),

    cssnanoTask = require(CONVERT_PATH + 'cssnano'),
    revcssTask = require(CONVERT_PATH + 'revcss'),
    uglifyTask = require(CONVERT_PATH + 'uglify'),
    revCollectorTask = require(CONVERT_PATH + 'revCollector'),
    addHeaderTask = require(CONVERT_PATH + 'addHeader'),

    imageTask = require(CONVERT_PATH + 'image'),
    spriteTask = require(CONVERT_PATH + 'sprite'),

    cssTask = require(WHOLE_PATH + 'css');

// 任务
// 删除 dist文件夹
gulp.task('clean', cleanTask);

// 编译 less scss stylus
gulp.task('less', lessTask);
gulp.task('scss', scssTask);
gulp.task('stylus', stylusTask);

// 编译 ES6
gulp.task('es6', es6Task);
// 编译ts
gulp.task('ts', tsTask);

gulp.task('md', mdTask);
// 转换 css(压缩,MD5)
gulp.task('cssnano', cssnanoTask);
gulp.task('revcss', revcssTask);

// 转换 替换html
gulp.task('revCollector', revCollectorTask);

// 转换 js(压缩)
// ps:压缩ES6代码时会报错
gulp.task('uglify', uglifyTask);

// 添加头部信息
gulp.task('addHeader', addHeaderTask);
// 压缩图片
gulp.task('image', imageTask);
// 合并sprite图 
gulp.task('sprite', spriteTask);

// whole css 完整流程(编译less,css前缀,合并,压缩,重命名,md5) 
// ps:还要执行 revCollectorTask
gulp.task('css', addHeaderTask);

gulp.task('default', ['clean'], callback => {
    // 同步运行任务插件
    runSequence(['clean', 'less', 'scss', 'stylus', 'es6', 'ts', 'cssnano', 'revcss', 'uglify', 'addHeader', 'image', 'sprite'], callback);
});