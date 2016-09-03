var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var jsFiles = ['*.js', 'server/**/*.js','/server/views/**/*.ejs'];

gulp.task('lint', function () {
  gulp.src(jsFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', {
      verbose: true,
    }));
});

gulp.task('inject', function () {
  var wiredep = require('wiredep').stream;
  var inject = require('gulp-inject');

  var injectSrc = gulp.src(['./client/public/stylesheets/*.css', './client/public/javascripts/*.js'], {
    read: false // we dont want to read files we just want the source
  });
  var injectOptions = {
    ignorePath: '/client/public',
  };
  var options = {
    bowerJson: require('./bower.json'),
    directory: './client/public/lib',
    ignorePath: '../../client/public/'
  };

  return gulp.src('./server/views/*.ejs')
    .pipe(wiredep(options))
    .pipe(inject(injectSrc, injectOptions))
    .pipe(gulp.dest('./server/views'));
});

gulp.task('serve', ['lint', 'inject'], function () {
  var started = false;
  return nodemon({
      script: 'server.js',
      // delayTime: 1,
      env: {
        PORT: 3000
      },
      watch: jsFiles,
    })
    .on('start', function () {
      // to avoid nodemon being started multiple times
      // thanks @matthisk
      if (!started) { cb();
        started = true;
      }
    })
    .on('restart', function (ev) {
      console.log('Restarting....');
    });
});

// gulp.task('serve-watch', ['serve'], function (done) {
//     browserSync.reload();
//     done();
// });

gulp.task('browser-sync', ['serve'], function () {
  browserSync.init({
    proxy: 'http://localhost:3000', // local node app address
    // browser: 'google chrome',
    port: 5000, // use *different* port than above
    notify: true
  });
});

// give nodemon time to restart
gulp.task('delay', function () {
  setTimeout(function () {
    browserSync.reload({stream: false});
  }, 1000);
});

gulp.task('default', ['browser-sync'], function () {
  gulp.watch('./client/public/**/*.js', browserSync.reload);
  gulp.watch('./client/public/**/*.css', browserSync.reload);
  gulp.watch(jsFiles, ['delay']);
});

//
// /**
//  * Created by Moiz.Kachwala on 08-06-2016.
//  */
//
//
// "use strict";
//
// const gulp = require("gulp"),
//     del = require("del"),
//     tsc = require("gulp-typescript"),
//     sourcemaps = require('gulp-sourcemaps'),
//     tsProject = tsc.createProject("tsconfig.json"),
//     tslint = require('gulp-tslint'),
//     concat = require('gulp-concat'),
//     runSequence = require('run-sequence'),
//     nodemon = require('gulp-nodemon'),
//     gulpTypings = require("gulp-typings");
//
// /**
//  * Remove build directory.
//  */
// gulp.task('clean', (cb) => {
//     return del(["dist"], cb);
// });
//
// /**
//  * Build Express server
//  */
// gulp.task('build:server', function () {
//     var tsProject = tsc.createProject('server/tsconfig.json');
//     var tsResult = gulp.src('server/src/**/*.ts')
//         .pipe(sourcemaps.init())
//         .pipe(tsc(tsProject))
//     return tsResult.js
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest('dist/server'))
// });
//
// gulp.task('build:client', function(){
//     var tsProject = tsc.createProject('client/tsconfig.json');
//     var tsResult = gulp.src('client/**/*.ts')
//         .pipe(sourcemaps.init())
//         .pipe(tsc(tsProject))
//     return tsResult.js
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest('dist/client'))
// });
//
// /**
//  * Lint all custom TypeScript files.
//  */
// gulp.task('tslint', () => {
//     return gulp.src("client/app/**/*.ts")
//         .pipe(tslint())
//         .pipe(tslint.report('prose'));
// });
//
//
// /**
//  * Compile TypeScript sources and create sourcemaps in build directory.
//  */
// gulp.task("compile", ["tslint"], () => {
//     let tsResult = gulp.src("client/**/*.ts")
//         .pipe(sourcemaps.init())
//         .pipe(tsc(tsProject));
//     return tsResult.js
//         .pipe(sourcemaps.write("."))
//         .pipe(gulp.dest("dist/client"));
// });
//
// /**
//  * Copy all resources that are not TypeScript files into build directory. e.g. index.html, css, images
//  */
// gulp.task("clientResources", () => {
//     return gulp.src(["client/**/*", "!**/*.ts","!client/typings", "!client/typings/**","!client/*.json"])
//         .pipe(gulp.dest("dist/client"));
// });
//
// /**
//  * Copy all required libraries into build directory.
//  */
// gulp.task("libs", () => {
//     return gulp.src([
//         'core-js/client/shim.min.js',
//         'zone.js/dist/zone.js',
//         'reflect-metadata/Reflect.js',
//         'systemjs/dist/system.src.js'
//     ], {cwd: "node_modules/**"}) /* Glob required here. */
//         .pipe(gulp.dest("dist/client/libs"));
// });
//
//
// /**
//  * Install typings for server and client.
//  */
// gulp.task("installTypings",function(){
//     var stream = gulp.src(["./server/typings.json","./client/typings.json"])
//         .pipe(gulpTypings(null)); //will install all typingsfiles in pipeline.
//     return stream; // by returning stream gulp can listen to events from the stream and knows when it is finished.
// });
//
// /**
//  * Start the express server with nodemon
//  */
// gulp.task('start', function () {
//     nodemon({ script: 'dist/server/server.js'
//         , ext: 'html js'
//         , ignore: ['ignored.js']
//         , tasks: ['tslint'] })
//         .on('restart', function () {
//             console.log('restarted!')
//         });
// });
//
// /**
//  * Build the project.
//  * 1. Clean the build directory
//  * 2. Build Express server
//  * 3. Build the Angular app
//  * 4. Copy the resources
//  * 5. Copy the dependencies.
//  */
//
// gulp.task("build", function (callback) {
//     runSequence('clean', 'build:server', 'build:client', 'clientResources', 'libs', callback);
// });
//
// /**
//  * Watch for changes in TypeScript, HTML and CSS files.
//  */
// gulp.task('watch', function () {
//     gulp.watch(["client/**/*.ts"], ['compile']).on('change', function (e) {
//         console.log('TypeScript file ' + e.path + ' has been changed. Compiling.');
//     });
//     gulp.watch(["client/**/*.html", "client/**/*.css"], ['clientResources']).on('change', function (e) {
//         console.log('Resource file ' + e.path + ' has been changed. Updating.');
//     });
//     gulp.watch(["server/src/**/*.ts"], ['compile']).on('change', function (e) {
//         console.log('TypeScript file ' + e.path + ' has been changed. Compiling.');
//     });
// });
//
// /**
//  * Build the project.
//  * 1. Clean the build directory
//  * 2. Build Express server
//  * 3. Build the Angular app
//  * 4. Copy the resources
//  * 5. Copy the dependencies.
//  */
//
// gulp.task("build", function (callback) {
//     runSequence('clean', 'build:server', 'build:client', 'clientResources', 'libs', callback);
// });
//
//
// gulp.task('default', function() {
//     runSequence( 'build:server', 'build:client', 'clientResources', 'libs','watch','start');
//
// });
