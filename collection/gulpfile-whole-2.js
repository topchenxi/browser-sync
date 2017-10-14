const
    gulp = require('gulp'),
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

constConfig = {
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
 *HTML处理
 */
gulp.task('html', () => {
    return gulp.src(Config.html.src)
        .pipe(gulp.dest(Config.html.dist));
});

/**
 *assets文件夹下的所有文件处理
 */
gulp.task('assets', () => {
    return gulp.src(Config.assets.src)
        .pipe(gulp.dest(Config.assets.dist));
});

/**
 *CSS样式处理
 */
gulp.task('css', () => {
    gulp.src(Config.css.src)
        .pipe(autoprefixer('last2version'))
        .pipe(gulp.dest(Config.css.dist))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano()) //执行压缩
        .pipe(gulp.dest(Config.css.dist))
        .pipe(notify({ message: 'csstaskcomplete' }));
});
/**
 *监听CSS文件的变化，变化后将执行CSS任务
 */
gulp.task('css-watch', () => {
    gulp.watch(Config.css.src, ['css']);
});

/**
 *SCSS样式处理
 */
gulp.task('sass', () => {
    return gulp.src(Config.sass.src)
        .pipe(autoprefixer('last2version'))
        .pipe(sass())
        .pipe(gulp.dest(Config.sass.dist))
        .pipe(rename({ suffix: '.min' })) //rename压缩后的文件名
        .pipe(cssnano()) //执行压缩
        .pipe(gulp.dest(Config.sass.dist))
        .pipe(notify({ message: 'sasstaskcomplete' }));
});
/**
 *监听SASS文件的变化，变化后将执行SASS任务
 */
gulp.task('sass-watch', () => {
    gulp.watch(Config.sass.src, ['sass']);
});

/**
 *js处理
 */
gulp.task('js', () => {
    gulp.src(Config.js.src)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest(Config.js.dist))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(Config.js.dist))
        .pipe(notify({ message: 'jstaskcomplete' }));
});
/**
 *合并所有js文件并做压缩处理
 */
gulp.task('js-concat', () => {
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
 *图片处理
 */
gulp.task('images', () => {
    return gulp.src(Config.img.src)
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest(Config.img.dist));
});

/**
 *清空图片、样式、js
 */
gulp.task('clean', () => {
    return del([Config.html.dist, Config.css.dist, Config.js.dist, Config.img.dist]);
});
gulp.task('clean-all', () => {
    return del([Config.html.dist, Config.assets, Config.css.dist, Config.js.dist, Config.img.dist]);
});

/**
 *默认任务清空图片、样式、js并重建运行语句gulp
 */
gulp.task('default', ['clean'], () => {
    gulp.start('html', 'assets', 'css', 'images', 'js');
});


/**
 *监听任务
 */
gulp.task('watch', () => {
    gulp.watch(Config.html.src, ['html']);
    gulp.watch(Config.css.src, ['css']);
    gulp.watch(Config.sass.src, ['sass']);
    gulp.watch(Config.assets.src, ['assets']);
    gulp.watch(Config.js.src, ['js']);
    gulp.watch(Config.img.src, ['images']);
    livereload.listen();
    gulp.watch([DIST_FILE]).on('change', livereload.changed);
});