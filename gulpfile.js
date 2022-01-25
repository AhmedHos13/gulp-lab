const gulp = require("gulp");
const { src, dest, series, parallel, watch } = require("gulp");

const htmlmin = require("gulp-htmlmin");
function htmlMinify() {
  return src("project/*.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
      })
    )
    .pipe(gulp.dest("build"));
}
exports.html = htmlMinify;

const concat = require("gulp-concat");
const cleanCss = require("gulp-clean-css");
function minifyCss() {
  return src("project/css/**/*.css")
    .pipe(concat("myStyle.min.css"))
    .pipe(cleanCss())
    .pipe(gulp.dest("build/assets/css"));
}

exports.css = minifyCss;

const terser = require("gulp-terser");
function jsMinify() {
  return src("project/js/**/*.js")
    .pipe(concat("all.min.js"))
    .pipe(terser())
    .pipe(dest("build/assets/js"));
}
exports.js = jsMinify;

const imgmin = require("gulp-imagemin");
function imgMinify() {
  return gulp
    .src("project/pics/*")
    .pipe(imgmin())
    .pipe(gulp.dest("build/pics"));
}
exports.img = imgMinify;

function watchTask() {
  watch("project/*.html", series(htmlMinify, reloadTask));
  watch("project/css/**/*.css", series(minifyCss, reloadTask));
  watch("project/js/**/*.js", series(jsMinify, reloadTask));
}

const browserSync = require("browser-sync");
function serve(done) {
  browserSync({
    server: {
      baseDir: "build",
    },
  });
  done();
}
function reloadTask(cb) {
  browserSync.reload();
  cb();
}

exports.default = series(
  parallel(htmlMinify, minifyCss, jsMinify /* imgMinify */),
  serve,
  watchTask
);
// exports.default = parallel(htmlMinify, minifyCss, jsMinify);
