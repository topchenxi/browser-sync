var gulp = require('gulp'),                         //基础库
clean = require('gulp-clean');                  //清空文件夹
cssmin = require('gulp-minify-css'),            //css压缩
uglify= require('gulp-uglify'),                 //js压缩
rev = require('gulp-rev'),                      //更改版本号
revCollector = require('gulp-rev-collector'),   //gulp-rev的插件，用于html模板更改引用路径
jshint = require('gulp-jshint'),                //js静态代码检查
replace = require('gulp-replace'),
concat = require('gulp-concat');                //合并文件


//要合并的js文件
var xk_jsArray = [
    'src/js/jquery.pin.js',
    'src/js/swiper/swiper.jquery.min.js',
    'src/js/xk-layer.js',
    'src/js/xk-searchSelect.js',
    'src/js/xk-tagSearchSelect.js',
    'src/js/fileUploader/xk-uploadFile.js',
    'src/js/loading/loading.js',
    'src/js/instant_reminder.js',
    'src/js/submit-button-control.js',
    'src/js/move_box.js',
    'src/js/user/loginout.js',
    'src/js/totop.js',
    'src/js/tagsConfiguration.js',
    'src/js/infoLayer.js'
];

var websocket_jsArray = [
'src/js/imengine.js',
'src/js/msgType.js',
'src/js/dwr/dwr-exception.js',
'src/js/system-msg/bulletin.js',
'src/js/system-msg/no_read_message.js',
'src/js/left_nav.js'
];    

//要合并的css文件
var cssArray = [
    'src/css/chat/chatnew.css',
    'src/css/skin/physician.css',
    'src/css/reset.css',
    'src/css/style.css',
    'src/css/followup/media_chat.css',
    'src/css/xk-drop.css',
    'src/css/swiper.css',
    'src/js/lib/umeditor/themes/default/css/umeditor.css',
    'src/css/fontawesome.css',
    'src/css/featureSpace.css'
];


//清空目标文件夹
gulp.task('clean',function(){
//read参数为false表示不读取文件的内容
return gulp.src('dist/',{read:false})
    .pipe(clean());
});

//将um编辑器库拷贝到目标文件夹
gulp.task('copy_js_umeditor',function(){
return gulp.src('src/js/lib/umeditor/**/*')
    .pipe(gulp.dest('dist/js/lib/umeditor'));
});

//将时间编辑器拷贝到目标文件夹
gulp.task('copy_js_date',function(){
return gulp.src('src/js/date-tool/**/*')
    .pipe(gulp.dest('dist/js/date-tool'));
});



gulp.task('replace_js_login',function(){
gulp.src('src/js/user/login.js')
    .pipe(replace('bindLoginEvent();',''))
    .pipe(gulp.dest('src/js/user'));
});



gulp.task('replace_css_um',function(){
gulp.src('src/js/lib/umeditor/themes/default/css/umeditor.css')
    .pipe(replace('../images/','../js/lib/umeditor/themes/default/images/'))
    .pipe(gulp.dest('src/js/lib/umeditor/themes/default/css'));
});


//合并css文件
gulp.task('css_concat',['replace_css_um'],function(){
return gulp.src(cssArray)
    .pipe(concat('xk.css'))
    .pipe(gulp.dest('src/css'))
});

//压缩css文件、为css文件添加上版本号
gulp.task('css_min_version',['css_concat'],function(){
return gulp.src('src/css/**/*.css')
    //压缩文件
    .pipe(cssmin({
        advanced: false,
        compatibility: 'ie7',
        keepBreaks: false
    }))
    //添加上版本号
    .pipe(rev())
    .pipe(gulp.dest('dist/css'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/manifest/css'));
});

//合并js文件
gulp.task('js_concat_xk',['copy_js_umeditor','copy_js_date','replace_js_login'],function(){
return gulp.src(xk_jsArray)
    .pipe(concat('xk.js'))
    .pipe(gulp.dest('src/js'));    

});

gulp.task('js_concat_websocket',function(){
return gulp.src(websocket_jsArray)
    .pipe(concat('websocket.js'))
    .pipe(gulp.dest('src/js'));    

});



//压缩js文件，为js文件添加上版本号
gulp.task('js_min_version',['js_concat_xk','js_concat_websocket'],function(){
return gulp.src('src/js/**/*.js')
    //压缩文件
    .pipe(uglify())
    //添加上版本号
    .pipe(rev())
    .pipe(gulp.dest('dist/js'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/manifest/js'));
});

//为图片文件添加上版本号
gulp.task('image_version',function(){
return gulp.src('src/images/**/*.{png,jpg,gif,ico}')
    .pipe(rev())
    .pipe(gulp.dest('dist/images'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/manifest/images'));
});

//html模板更改引用路径
gulp.task('html_replace',['css_min_version','js_min_version','image_version'],function(){
return gulp.src(['dist/manifest/**/*.json','src/page/**/*.jsp'])
    .pipe(revCollector({
        replaceReved:true
    }))
    .pipe(gulp.dest('dist/page'));
});


//默认执行任务
gulp.task('default',['clean'],function(){
gulp.start('html_replace');
});

