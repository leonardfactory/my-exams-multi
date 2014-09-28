var gulp    = require('gulp');
var gutil   = require('gulp-util');
var bower   = require('bower');
var concat  = require('gulp-concat');
var uglify  = require('gulp-uglify');
var sass    = require('gulp-sass');
var coffee  = require('gulp-coffee');
var sourcemaps      = require('gulp-sourcemaps');
var ngAnnotate      = require('gulp-ng-annotate');
var ngTemplateCache = require('gulp-angular-templatecache');
var minifyCss       = require('gulp-minify-css');
var jade    = require('gulp-jade');
var rename  = require('gulp-rename');
var sh      = require('shelljs');

var paths = {
  app: ['./app/**/*.coffee'],
  sass: ['./scss/**/*.scss'],
  template: ['./app/templates/**/*.jade']
};

gulp.task('default', ['sass', 'make']);

gulp.task('make', function() {
  gulp.src(paths.app)
    .pipe(sourcemaps.init())                            // Genero le source maps
    .pipe(coffee({bare: true}).on('error', gutil.log))  // Compilo coffeescript
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./www/js/'));
});

gulp.task('make:prod', function() {
  gulp.src(paths.app)
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('./www/dist/js/'));
});

gulp.task('jade', function () {
  gulp.src(paths.template)
    .pipe(jade())
    .pipe(gulp.dest('./www/templates/'))
});

gulp.task('jade:prod', function() {
  gulp.src(paths.template)
    .pipe(jade())
    .pipe(ngTemplateCache({root: 'templates/'}))
    .pipe(gulp.dest('./www/dist/js/'));
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.app, ['make']);
  gulp.watch(paths.template, ['jade']);
});

gulp.task('build',      ['sass', 'make', 'jade']);
gulp.task('build:prod', ['sass', 'make:prod', 'jade:prod']);

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
