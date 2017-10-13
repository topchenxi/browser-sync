// 引入 gulp及组件  
let gulp = require('gulp'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    del = require('del');
    
let SRC_DIR = './src/';
let DIST_DIR = './dist/';
let DIST_FILE = DIST_DIR + '**';

const Config = {
    html: {
        src: SRC_DIR + '*.html',
        dist: DIST_DIR
    },
    assets: {
        src: SRC_DIR + 'assets/**/*',
        dist: DIST_DIR + 'assets'
    },
    css: {
        src: SRC_DIR + 'css/**/*.css',
        dist: DIST_DIR + 'css'
    },
    sass: {
        src: SRC_DIR + 'scss/**/*.scss',
        dist: DIST_DIR + 'css'
    },
    js: {
        src: SRC_DIR + 'js/**/*.js',
        dist: DIST_DIR + 'js',
        build_name: 'build.js'
    },
    img: {
        src: SRC_DIR + 'images/**/*',
        dist: DIST_DIR + 'images'
    }
};


/** 
 * HTML处理 
 */
gulp.task('html', function() {
    gulp.src(Config.html.src)
        .pipe(gulp.dest(Config.html.dist));
});

/** 
 * assets文件夹下的所有文件处理 
 */
gulp.task('assets', function() {
    gulp.src(Config.assets.src)
        .pipe(gulp.dest(Config.assets.dist));
});

/** 
 * CSS样式处理 
 */
gulp.task('css', function() {
    gulp.src(Config.css.src)
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest(Config.css.dist))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano()) //执行压缩  
        .pipe(gulp.dest(Config.css.dist))
        .pipe(notify({ message: 'css task complete' }));
});
/** 
 * 监听CSS文件的变化，变化后将执行CSS任务 
 */
gulp.task('css-watch', function() {
    gulp.watch(Config.css.src, ['css']);
});

/** 
 * SCSS样式处理 
 */
gulp.task('sass', function() {
    return gulp.src(Config.sass.src)
        .pipe(autoprefixer('last 2 version'))
        .pipe(sass())
        .pipe(gulp.dest(Config.sass.dist))
        .pipe(rename({ suffix: '.min' })) //rename压缩后的文件名  
        .pipe(cssnano()) //执行压缩  
        .pipe(gulp.dest(Config.sass.dist))
        .pipe(notify({ message: 'sass task complete' }));
});
/** 
 * 监听SASS文件的变化，变化后将执行SASS任务 
 */
gulp.task('sass-watch', function() {
    gulp.watch(Config.sass.src, ['sass']);
});

/** 
 * js处理 
 */
gulp.task('js', function() {
    gulp.src(Config.js.src)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest(Config.js.dist))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(Config.js.dist))
        .pipe(notify({ message: 'js task complete' }));
});
/** 
 * 合并所有js文件并做压缩处理 
 */
gulp.task('js-concat', function() {
    gulp.src(Config.js.src)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat(Config.js.build_name))
        .pipe(gulp.dest(Config.js.dist))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(Config.js.dist))
        .pipe(notify({ message: 'js-concat task complete' }));
});

/** 
 * 图片处理 
 */
gulp.task('images', function() {
    return gulp.src(Config.img.src)
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest(Config.img.dist))
    /*.pipe(notify({ message: 'images task complete' }))*/
    ;
});

/** 
 * 清空图片、样式、js 
 */
gulp.task('clean', function() {
    return del([Config.html.dist, Config.css.dist, Config.js.dist, Config.img.dist]);
});
gulp.task('clean-all', function() {
    return del([Config.html.dist, Config.assets, Config.css.dist, Config.js.dist, Config.img.dist]);
});

/** 
 * 默认任务 清空图片、样式、js并重建 运行语句 gulp 
 */
gulp.task('default', ['clean'], function() {
    gulp.start('html', 'assets', 'css', 'images', 'js');
});


/** 
 * 监听任务 
 */
gulp.task('watch', function() {
    // Watch .html files  
    gulp.watch(Config.html.src, ['html']);

    // Watch .css files  
    gulp.watch(Config.css.src, ['css']);

    // Watch .scss files  
    gulp.watch(Config.sass.src, ['sass']);

    // Watch assets files  
    gulp.watch(Config.assets.src, ['assets']);

    // Watch .js files  
    gulp.watch(Config.js.src, ['js']);

    // Watch image files  
    gulp.watch(Config.img.src, ['images']);

    // Create LiveReload server  
    livereload.listen();

    // Watch any files in dist/, reload on change  
    gulp.watch([DIST_FILE]).on('change', livereload.changed);
});