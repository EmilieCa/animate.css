const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const del = require('del');
const cleanCSS = require('gulp-clean-css');

gulp.task('test', function(done) {
    console.log('allô');
    done();
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir:"./src/"
        }
    });
});

gulp.task('sass', function() {
    return gulp.src('src/assets/styles/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/assets/styles/css/'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('clear-scripts', function() {
    return del('src/assets/scripts/vendors/**/*.js');
});

gulp.task('update-scripts', function() {
    return gulp.src('src/assets/scripts/vanilla/**/*.js')
    .pipe(rollup({ plugins: [babel(), resolve(), commonjs()]}, 'umd' ))
    .pipe(gulp.dest('src/assets/scripts/vendors/'))
    .pipe(browserSync.reload({
        stream:true
    }));
});

gulp.task('scripts', gulp.series('clear-scripts', 'update-scripts'));

gulp.task('watch', function() {
    gulp.watch('src/assets/styles/scss/**/*.scss', gulp.series('sass'));
    gulp.watch('src/**/*.html', browserSync.reload);
    gulp.watch('src/assets/scripts/vanilla/**/*.js', gulp.series('scripts'));
});

gulp.task('dev', gulp.series('sass', gulp.parallel('browser-sync', 'watch')));

gulp.task('build-styles', function () {
    return gulp.src('src/assets/styles/css/**/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/assets/styles/css'));
});

gulp.task('build-scripts', function() {
    return gulp.src('src/assets/scripts/vendors/**/*')
    .pipe(gulp.dest('dist/assets/scripts/vendors'));
});

gulp.task('build-img', function() {
    return gulp.src('src/assets/img/**/*')
    .pipe(gulp.dest('dist/assets/img'));
});

gulp.task('build-template', function() {
    return gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('build', gulp.series('build-styles', 'build-scripts', 'build-img', 'build-template'));