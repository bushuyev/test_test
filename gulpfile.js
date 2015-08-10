var gulp = require('gulp');
var traceur = require('gulp-traceur');
var express = require('express');
var fs = require('fs-extra');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var http = require('http');
var Builder = require('systemjs-builder');
var vulcanize = require('gulp-vulcanize');
var minifyHTML = require('gulp-minify-html');

var wctTest = require('web-component-tester').gulp.init(gulp);

var config = {
  admin: {
    src: './src/',
    dst: './dist/'
  }
};

gulp.task('clean', function () {
  fs.deleteSync(config.admin.dst);
});


gulp.task('copy-assets', ['clean'], function() {
  fs.mkdirSync('dist');

  //TODO get rid of fs
  fs.copySync('bower_components', config.admin.dst+'bower_components');
  fs.copySync(config.admin.src, config.admin.dst);
  fs.deleteSync(config.admin.dst+'elements/*.js');
  fs.deleteSync(config.admin.dst+'elements/model/*.js');
});


gulp.task('traceur', ['copy-assets'], function () {

  gulp.src(config.admin.src+'elements/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(traceur({ modules: 'instantiate'}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(config.admin.dst+'elements/'));
});

gulp.task('serve', ['systemjs'], function() {
  var app = express();

  app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "localhost");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use(express.static(config.admin.dst));

  var server = app.listen(9090);
  console.log("running");
});


gulp.task('watch', ['serve'], function () {
  gulp.watch([
    config.admin.src+'/*.html',
    config.admin.src+'/*.js',
    config.admin.src+'elements/**/*.html',
    config.admin.src+'elements/**/*.js',
    config.admin.src+'css/*.css'
  ], ['systemjs']);
});

gulp.task('systemjs', ['copy-assets'], function(done){
  return new Builder({
    baseURL: '.',

    // opt in to Babel for transpiling over Traceur
    transpiler: 'traceur'

    // etc. any SystemJS config
  }).buildSFX('src/elements/all.js', 'dist/elements.js', { sfxGlobalName: 'elements', minify: false, sourceMaps:false })

      .then(function() {
        console.log('Build complete');

  }).catch(function(err) {
        console.log('Build error');
        console.log(err);
    });

});

gulp.task('vulcanize', ['systemjs'], function () {
  return gulp.src(config.admin.dst+'/index.html')
      .pipe(vulcanize({
        inlineScripts: true,
        inlineCss: true,
        stripComments: true
      }))
      .pipe(minifyHTML({
        conditionals: true,
        spare:true
      }))
      .pipe(gulp.dest(config.admin.dst+'release'));
});


gulp.task('wct', ['systemjs', 'test:local'], function(done) {

});