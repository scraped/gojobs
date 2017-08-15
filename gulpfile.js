'use strict';

const gulp          = require('gulp');
const sass          = require('gulp-sass');
const sourcemaps    = require('gulp-sourcemaps');
const debug         = require('gulp-debug');
const gulpIf        = require('gulp-if');
const newer         = require('gulp-newer');
const autoprefixer  = require('gulp-autoprefixer');
const notify        = require('gulp-notify');
const eslint        = require('gulp-eslint');
const del           = require('del');
const browserSync   = require('browser-sync').create();

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'dev';

const appDir = './src/';

gulp.task('lint', () => {
  return gulp.src(appDir + 'js/*.*')
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('styles', () => {
  return gulp.src(appDir + 'sass/app.sass')
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(sass({ outputStyle: 'compressed' })
    // .on('error', sass.logError))
    .on('error', notify.onError(err => {
      return {
        title: 'SASS',
        message: err.message,
      };
    })))
    .pipe(autoprefixer())
    .pipe(gulpIf(isDev, sourcemaps.write()))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('images', () => {
  return gulp.src(appDir + '{images,js}/*.*', {since: gulp.lastRun('images')})
    .pipe(newer('./public/images'))
    .pipe(debug({title: 'images/scripts'}))
    .pipe(gulp.dest('./public'));
});

gulp.task('clean', () => {
  return del('./public');
});

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('styles', 'images')
));

gulp.task('watch', () => {
  gulp.watch(appDir + 'sass/*.sass', gulp.series('styles'));
  gulp.watch(appDir + '{images,js}/*.*', gulp.series('images'));
});

gulp.task('serve', () => {
  browserSync.init({
    server: './public'
  });

  browserSync.watch('./public/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev',
  gulp.series('build', gulp.parallel('watch', 'serve'))
);

gulp.task('dev:noserve',
  gulp.series('build', 'watch')
);
