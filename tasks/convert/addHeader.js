const fs = require('fs'),
    gulp = require('gulp'),
    header = require('gulp-header'),
    plumber = require('gulp-plumber'),
    pkg = JSON.parse(fs.readFileSync('package.json')),
    banner = [
        '@charset "UTF-8";\n',
        '/*!',
        ' * <%= name %> -<%= homepage %>',
        ' * Version - <%= version %>',
        ' *',
        ' * Copyright (c) <%= new Date().getFullYear() %> <%= author %>',
        ' */\n\n'
    ].join('\n');

module.exports = () => {
    return gulp.src(['dist/*.css', 'dist/**/*.css'])
        .pipe(plumber())
        .pipe(header(banner, pkg))
        .pipe(gulp.dest('dist'));
};