var gulp = require('gulp');
var traceur = require('gulp-traceur');
var express = require('express');
var fs = require('fs-extra');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var http = require('http');


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


  fs.copySync('bower_components', config.admin.dst+'bower_components');
  fs.copySync(config.admin.src, config.admin.dst);

});


gulp.task('traceur', ['copy-assets'], function () {

  gulp.src(config.admin.src+'elements/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(traceur({ modules: 'instantiate'}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(config.admin.dst+'elements/'));
});

gulp.task('serve', ['traceur'], function() {
  var app = express();

  app.use(function(req, res, next) {
    console.log("headers");
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
  ], ['traceur']);
});




gulp.task('wct', ['traceur', 'test:local'], function(done) {

});