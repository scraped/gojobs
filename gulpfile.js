'use strict';

const config = require('./config');
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const del = require('del');
const browserSync = require('browser-sync').create();

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'dev';

gulp.task('lint', () => {
  return gulp.src(`${config.srcDir}js/*.*`)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

gulp.task('styles', () => {
  return gulp.src(`${config.srcDir}sass/app.sass`)
    .pipe(plugins.if(isDev, plugins.sourcemaps.init()))
    .pipe(plugins.sass({
      outputStyle: isDev ? 'expanded' : 'compressed'
    })
    .on('error', plugins.notify.onError(err => {
      return {
        title: 'SASS Error',
        message: err.message,
      };
    })))
    .pipe(plugins.autoprefixer())
    .pipe(plugins.if(isDev, plugins.sourcemaps.write()))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('images', () => {
  return gulp.src(
    `${config.srcDir}{images,js}/*.*`,
    { since: gulp.lastRun('images') }
  )
    .pipe(plugins.newer('./public/images'))
    .pipe(plugins.debug({title: 'images/scripts'}))
    .pipe(gulp.dest('./public'));
});

gulp.task('clean', () => {
  return del('./public');
});

gulp.task('build',
  gulp.series('clean', gulp.parallel('styles', 'images'))
);

gulp.task('watch', () => {
  gulp.watch(`${config.srcDir}sass/**/*.*`, gulp.series('styles'));
  gulp.watch(`${config.srcDir}{images,js}/*.*`, gulp.series('images'));
});

let started = false;

gulp.task('nodemon', (cb) => {
  return plugins.nodemon({ script: 'index.js' }).on('start', function() {
    browserSync.init({
      proxy: `localhost:${config.port}`,
      port: 3001
    }, cb);
    browserSync.watch('./public/**/*.*').on('change', browserSync.reload);
  })
});

gulp.task('serve', (cb) => {
});

//
// Main task: build + browserSync + nodemon
//
gulp.task('dev',
  gulp.series('build', gulp.parallel('watch', 'nodemon'))
);

//
// dev is a default task (gulp = gulp dev)
//
gulp.task('default',
  gulp.series('dev')
);
