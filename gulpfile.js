'use strict';

const config = require('./config');
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const del = require('del');
const browserSync = require('browser-sync').create();

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'dev';
console.log(process.env.NODE_ENV);

gulp.task('lint', () => {
  return gulp.src(`${config.srcDir}js/*.*`)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

gulp.task('styles', () => {
  return gulp.src(`${config.srcDir}sass/app.sass`)
    .pipe(plugins.if(isDev, plugins.sourcemaps.init()))
    .pipe(plugins.sass({ outputStyle: 'compressed' })
    // .on('error', sass.logError))
    .on('error', plugins.notify.onError(err => {
      return {
        title: 'SASS',
        message: err.message,
      };
    })))
    .pipe(plugins.autoprefixer())
    .pipe(plugins.if(isDev, plugins.sourcemaps.write()))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('images', () => {
  return gulp.src(`${config.srcDir}{images,js}/*.*`, {since: gulp.lastRun('images')})
    .pipe(plugins.newer('./public/images'))
    .pipe(plugins.debug({title: 'images/scripts'}))
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
  gulp.watch(config.srcDir + 'sass/*.sass', gulp.series('styles'));
  gulp.watch(config.srcDir + '{images,js}/*.*', gulp.series('images'));
});

gulp.task('serve', () => {
  browserSync.init({ proxy: `localhost:${config.port}` });
  browserSync.watch('./public/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev',
  gulp.series('build', gulp.parallel('watch', 'serve'))
);

gulp.task('dev:noserve',
  gulp.series('build', 'watch')
);

gulp.task('default',
  gulp.series('dev')
);
