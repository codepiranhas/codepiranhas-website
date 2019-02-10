var gulp = require("gulp");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");
var sourcemaps = require("gulp-sourcemaps");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var browserSync = require("browser-sync").create();

// Put this after including our dependencies
var paths = {
  styles: {
      // By using styles/**/*.sass we're telling gulp to check all folders for any sass file
      src: "src/css/index.scss",
      // Compiled files will end up in whichever folder it's found in (partials are not compiled)
      dest: "public/css"
  },

  html: {
   src: "src/**/*.html",
   dest: "public"
  },

  js: {
    src: "src/js/**/*.js",
    dest: "public/js"
  },

  images: {
    src: "src/images/**/*",
    dest: "public/images"
  }
};

// Define tasks after requiring dependencies
function style() {
  return (
    gulp
      .src(paths.styles.src)
      // Initialize sourcemaps before compilation starts
      .pipe(sourcemaps.init())
      .pipe(sass())
      .on("error", sass.logError)
      // Use postcss with autoprefixer and compress the compiled file using cssnano
      .pipe(postcss([autoprefixer({ browsers: ['last 3 versions'] }), cssnano()]))
      .pipe(concat('styles.min.css'))
      // Now add/write the sourcemaps
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(paths.styles.dest))
      // Add browsersync stream pipe after compilation
      .pipe(browserSync.stream())
  );
}

function html() {
  return (
    gulp
      .src(paths.html.src)
      .pipe(gulp.dest(paths.html.dest))
  )
}

function js() {
  return (
    gulp
      .src(paths.js.src)
      .pipe(uglify())
      .pipe(concat('main.min.js'))
      .pipe(gulp.dest(paths.js.dest))
  )
}

// A simple task to reload the page
function reload() {
  browserSync.reload();
}

// Image optimization
function image() {
  return (
    gulp.src(paths.images.src)
      .pipe(imagemin())
      .pipe(gulp.dest(paths.images.dest))
  )
}

// Add browsersync initialization at the start of the watch task
function watch() {
  html();
  style();
  js();

  browserSync.init({
      // You can tell browserSync to use this directory and serve it as a mini-server
      server: {
          baseDir: "./public"
      }
      // If you are already serving your website locally using something like apache
      // You can use the proxy setting to proxy that instead
      // proxy: "yourlocal.dev"
  });
  gulp.watch(paths.styles.src, style);
  gulp.watch(paths.html.src, html);
  gulp.watch(paths.js.src, js);
  	
  // We should tell gulp which files to watch to trigger the reload
  // This can be html or whatever you're using to develop your website
  // Note -- you can obviously add the path to the Paths object
  gulp.watch(paths.html.src, reload);
}

function build(done) {
  return gulp.series(
    html,
    style,
    js,
    image
  )(done);
}

// Don't forget to expose the tasks!
exports.watch = watch;
exports.build = build;
