
var gulp = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass')(require('sass'));
var plumber = require('gulp-plumber');
var prefix = require('gulp-autoprefixer');
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var del = require('del');
// var browserSync = require('browser-sync');

function clean() {
    return del(['dist/**/*']);
}

function styles() {
    var onError = function(err) {
        notify.onError({
            title:    "Gulp",
            subtitle: "Failure!",
            message:  "Error: <%= error.message %>",
            sound:    "Beep"
        })(err);
        this.emit('end');
    };

    return gulp.src('src/scss/index.scss', { sourcemaps: true})
        .pipe(sourcemaps.init())
        .pipe(prefix())
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(rename({
            basename: 'style',
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css'));
}

function javaScript() {
    return gulp.src(['src/js/**/*.js'], { sourcemaps: true })
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/js/'));
}

function watch() {
    gulp.watch('src/scss/**/*.scss', styles);
    gulp.watch('src/js/**/*.js', javaScript);
}

var build = gulp.series(clean, gulp.parallel(styles, javaScript));

exports.build = build;
exports.default = gulp.series(clean, gulp.parallel(styles, javaScript, watch));
