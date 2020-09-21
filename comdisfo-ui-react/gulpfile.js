'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var rename = require('gulp-rename');
var pkg = require('./package.json');

var beginBanner = '/**\n  ComDisFo-React-UI v<%= pkg.version %>\n\n';
var banner = beginBanner + 
    '  <%= pkg.homepage %>\n  <%= pkg.copyright %>\n*/\n';
var bannerDep = beginBanner + 
    '  dependencies: Bootstrap (partial), react-datepicker...\n*/\n';

var sig='Community Discussion Forum UI React'+ ' Version '+pkg.version+'\n\n'+ Date()+'\n';

console.log(sig);

gulp.task('css', function () {
  return gulp.src('./sass/comdisfo.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(header(banner, { pkg : pkg }))
    .pipe(rename('comdisfo-ui-react.css'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('css-min', function () {
  return gulp.src('./sass/comdisfo.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(header(banner, { pkg : pkg }))
    .pipe(rename('comdisfo-ui-react.min.css'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('dep-min', function () {
  return gulp.src('./sass/dependencies.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(header(bannerDep, { pkg : pkg }))
    .pipe(rename('dependencies.min.css'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('default', ['css', 'css-min', 'dep-min']);
gulp.task('dev', ['css']);

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});
