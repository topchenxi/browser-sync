/* 依赖包加载 	*/
const path = require('path'),
    gulp = require('gulp'),

    ugjs = require('gulp-uglify'), //压缩javascript文件,减小文件大小
    watch = require('gulp-watch'), //监视文件变化,自动执行
    webpackStream = require('webpack-stream'), //集成webpack流
    webpack = require('webpack'),
    named = require('vinyl-named'), //该插件保证webpack生成的文件名能够和原文件对上
    del = require('del'),
    watchPath = require('gulp-watch-path'), //当文件夹文件很多时，可以利用 gulp-watch-path “一对一”编译
    replace = require('gulp-replace'), //字符串替换

    rev = require('gulp-rev'), //给静态文件加hash散列
    ifElse = require('gulp-if-else'), //添加判断
    browserSync = require('browser-sync').create(), //异步刷新重载浏览器
    base64 = require('gulp-base64'), //将图片转为base4格式
    runSequence = require('run-sequence'), //运行一个序列的任务
    bsReload = browserSync.reload,
    postcss = require('gulp-postcss'), //postcss本身
    autoprefixer = require('autoprefixer'),
    precss = require('precss'), //提供像scss一样的语法
    cssnano = require('cssnano'), //更好用的css压缩!
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    revCollector = require('gulp-rev-collector'), //给资源文件加时间戳，rev替换文件名
    newer = require('gulp-newer'), //增量更新
    mocha = require('gulp-mocha'); //单元测试

/* 主文件 	*/

let webpackConfig = {
    resolve: {
        root: path.join(__dirname, 'node_modules'),
        extensions: ['', '.js', '.scss', '.css']
    },
    output: {
        // distPath: 'yourcdnlink/static/',
        filename: 'js/[name].js',
        chunkFilename: 'js/[id].js?[hash]'
    },
    module: {
        loaders: [
            // 这里不需要vue，先注释掉
            // {test: /\.vue$/, loader: 'vue'},
            { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
            {
                test: /\.(png|jpe?g|gif)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 5000, // 换成你想要得大小
                    name: 'images/[name].[ext]?[hash:10]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 5000, // 换成你想要得大小
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [],
    babel: { //配置babel
        "presets": ["es2015", 'stage-2'],
        "plugins": ["transform-runtime"]
    }
};

const processes = [
    autoprefixer({ browsers: ['last 2 version', 'safari 5', 'opera 12.1', 'ios 6', 'android 4', '> 10%'] }),
    precss,
    cssnano
];
/*
   sass编译后放到dist目录的css文件夹中
   其余文件处理后输出到dist/相同文件夹中
   html移到view目录下
 */
const src = {
    css: './src/css/**/*.css',
    fonts: './src/static/fonts/**/*.{eot,svg,ttf,woff}',
    images: './src/static/images/**/*.{png,jpg,jpeg}',
    js: './src/js/**/*.js',
    sass: './src/sass/**/*.{scss,css}',
    views: './src/views/**/*.html'
};

const dist = {
    css: './dist/css/',
    fonts: './dist/static/fonts/',
    images: './dist/static/images/',
    js: './dist/js/',
    sass: './public/sass/',
    views: './dist/views'
};

/*
  build
 */
let BUILD = "DEV";
gulp.task('views', function() {
    return gulp.src(src.views)
        .pipe(gulp.dest(dist.views));
});
gulp.task('sass', function() {
    return gulp.src(src.sass)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./src/css'))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('reload', function() {

    webpackConfig.plugins.push(new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'dev'
    }));
    runSequence('views', 'sass', 'js', 'images', 'fonts', function() {
        browserSync.init(dist.views, {
            startPath: "/views/",
            server: {
                baseDir: ['./dist']
            },
            notify: false
        });
        dev(); // watch

    });
});


function dev() {
    watch([src.views], function() {
        runSequence('views', function() {
            bsReload()
        });
    });
    watch([src.sass], function() {
        runSequence('sass', function() {
            bsReload();
        });
    });
    watch([src.images], function() {
        runSequence('images', function() {
            bsReload()
        });
    });
    watch([src.fonts], function() {
        runSequence('fonts', function() {
            bsReload()
        });
    });
    f([src.js], function(event) {
        let paths = watchPath(event, src.js, './dist/js/');
        let sp = paths.srcPath.indexOf('\\') > -1 ? '\\' : '/';

        if (paths.srcPath.split(sp).length === 3) { // 共有库情况,要编译所有js
            compileJS(['./src/js/**/*.js', '!./src/js/lib/*.js']);
        } else { // 否则 只编译变动js
            compileJS(paths.srcPath);
        }
    });
}


gulp.task('js', function() {
    cp('./src/js/lib/*.js', './dist/js/lib');
    return compileJS(['./src/js/**/*.js', '!./src/js/lib/*.js']);
});

gulp.task('images', function() {
    gulp.src(src.images)
        // 增量更新，加快gulp构建速度
        .pipe(newer(dist.images))
        .pipe(gulp.dest(dist.images));
});
gulp.task('fonts', function() {
    return gulp.src(src.fonts)
        .pipe(newer(dist.fonts))
        .pipe(gulp.dest(dist.fonts));
});
gulp.task('js:build', function() {
    cp('./src/js/lib/*.js', './src/tmp/js/lib');
    return compileJS(['./src/js/**/*.js', '!./src/js/lib/*.js'], './src/tmp');
});
gulp.task('ugjs:build', function() {
    return gulp.src('./src/tmp/**/*.js')
        .pipe(ifElse(BUILD === 'build', ugjs))
        .pipe(rev())
        .pipe(gulp.dest('./dist/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./dist/'))
});

function compileJS(path, dest) {
    dest = dest || './dist';
    webpackConfig.output.distPath = '/';

    return gulp.src(path)
        .pipe(named(function(file) {
            let path = JSON.parse(JSON.stringify(file)).history[0];
            let sp = path.indexOf('\\') > -1 ? '\\js\\' : '/js/';
            let target = path.split(sp)[1];
            return target.substring(0, target.length - 3);
        }))
        .pipe(webpackStream(webpackConfig))
        .on('error', function(err) {
            this.end()
        })
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(gulp.dest(dest))
}

function cp(from, to) {
    gulp.src(from)
        .pipe(gulp.dest(to));
}

gulp.task('views:build', function() {
    return gulp.src(['./dist/**/*.json', src.views])
        .pipe(revCollector({
            replaceReved: true
        }))
        // .pipe(replace('../../', '' + '/')) // 替换html页面静态资源地址
        // .pipe(replace('../', '' + '/')) // 替换html页面静态资源地址
        .pipe(gulp.dest(dist.views));
});

gulp.task('build', function() {
    BUILD = 'build';
    webpackConfig.plugins.push(new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'production'
    }));
    build(function() {
        del(['./src/tmp'])
    });
});
gulp.task('css:build', function() {
    return gulp.src(src.css)
        .pipe(base64({
            extensions: ['png', /\.jpg#datauri$/i],
            maxImageSize: 10 * 1024 // bytes,
        }))
        .pipe(ifElse(BUILD === 'build', function() {
            return postcss(processes)
        }))
        .pipe(rev())
        .pipe(gulp.dest(dist.css))
        .pipe(rev.manifest())
        .pipe(gulp.dest(dist.css))

});

function build(cb) {
    runSequence('clean', 'sass', 'css:build', 'js:build', 'ugjs:build', 'views:build', 'images', 'fonts', 'cleancss', function() {
        cb && cb();
    });
}
gulp.task('clean', function() {
    del([
        'dist/**/*'
    ]);

});
gulp.task('cleancss', function() {
    del([
        'src/css'
    ]);

});

/* 单元测试 单独出来 */
gulp.task('mocha', function() {
    return gulp.src(['test/*.js'], { read: false })
        .pipe(mocha({ reporter: 'nyan' }))
});

gulp.task('test', function() {
    gulp.watch(['lib/**', 'test/**'], ['mocha']);
});