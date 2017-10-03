const config = require('./config');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const notify = require('gulp-notify');
const newer = require('gulp-newer');
const debug = require('gulp-debug');
const nodemon = require('gulp-nodemon');
const del = require('del');
const browserSync = require('browser-sync').create();

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'dev';

gulp.task('styles', () => {
  return gulp.src(`${config.srcDir}sass/app.sass`)
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(sass({ outputStyle: isDev ? 'expanded' : 'compressed' })
      .on('error', notify.onError(err => {
        return {
          title: 'SASS Error',
          message: err.message,
        };
      })))
    .pipe(autoprefixer())
    .pipe(gulpIf(isDev, sourcemaps.write()))
    .pipe(debug({ title: 'styles' }))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('images', () => {
  return gulp.src(
    `${config.srcDir}images/*.*`,
    { since: gulp.lastRun('images') }
  )
    .pipe(newer('./public/images'))
    .pipe(debug({ title: 'images' }))
    .pipe(gulp.dest('./public/images'));
});

gulp.task('clean', () => {
  return del('./public');
});

gulp.task('build',
  gulp.series('clean', gulp.parallel('styles', 'images'))
);

gulp.task('watch', callback => {
  gulp.watch(`${config.srcDir}sass/**/*.*`, gulp.series('styles'));
  gulp.watch(`${config.srcDir}{images,js}/*.*`, gulp.series('images'));
  callback();
});

gulp.task('nodemon', callback => {
  nodemon({ script: './app' }).on('start', function () {
    let called = false;
    if (!called) {
      called = true;
      callback();
    }
  })
    .on('restart', function () {
      setTimeout(function () {
        browserSync.reload();
      }, 2500);
    });
});

gulp.task('serve', callback => {
  browserSync.init({
    proxy: `localhost:${config.port}`,
    port: config.port + 1
  }, callback);
  browserSync.watch('./public/**/*.*').on('change', browserSync.reload);
});

//
// Main task: build + browserSync + nodemon
//
gulp.task('dev',
  gulp.series('build', 'nodemon', gulp.parallel('watch', 'serve'))
);

gulp.task('dev:noserve',
  gulp.series('build', 'nodemon', 'watch')
);

//
// dev is a default task (gulp = gulp dev)
//
gulp.task('default',
  gulp.series('dev')
);
