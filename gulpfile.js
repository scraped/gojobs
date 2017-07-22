"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const debug = require("gulp-debug");
const gulpIf = require("gulp-if");
const newer = require("gulp-newer");
const autoprefixer = require("gulp-autoprefixer");
const del = require("del");
const browserSync = require("browser-sync").create();

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == "dev";

gulp.task("styles", () => {
  return gulp.src("./frontend/sass/app.sass")
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(sass({
      outputStyle: "compressed"
    }).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(gulpIf(isDev, sourcemaps.write()))
    .pipe(gulp.dest("./public/css"));
});

gulp.task("images", () => {
  return gulp.src("./frontend/images/*.*", {since: gulp.lastRun("images")})
    .pipe(newer("./public/images"))
    .pipe(debug({title: "images"}))
    .pipe(gulp.dest("./public/images"));
});

gulp.task("templates", () => {
  return gulp.src("./frontend/templates/*.*", {since: gulp.lastRun("templates")})
    .pipe(newer("./public/templates"))
    .pipe(debug({title: "templates"}))
    .pipe(gulp.dest("./public"));
});

gulp.task("clean", () => {
  return del("./public");
});

gulp.task("build", gulp.series(
  "clean",
  gulp.parallel("styles", "images", "templates")
));

gulp.task("watch", () => {
  gulp.watch("./frontend/sass/*.sass", gulp.series("styles"));
  gulp.watch("./frontend/images/*.*", gulp.series("images"));
  gulp.watch("./frontend/templates/*.*", gulp.series("templates"));
});

gulp.task("serve", () => {
  browserSync.init({
    server: "./public"
  });

  browserSync.watch("./public/**/*.*").on("change", browserSync.reload);
});

gulp.task("dev",
  gulp.series("build", gulp.parallel("watch", "serve"))
);
