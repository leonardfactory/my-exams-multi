var gulp    = require('gulp');
require('gulp-help')(gulp);

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
var autoprefixer    = require('gulp-autoprefixer');
var jade    = require('gulp-jade');
var rename  = require('gulp-rename');
var sh      = require('shelljs');
var serve   = require('gulp-serve');

var paths = {
  app: ['./app/scripts/**/*.coffee'],
  sass: ['./scss/**/*.scss'],
  style: ['./app/styles/**/*.scss'],
  template: ['./app/templates/**/*.jade']
};

gulp.task('default', ['build']);

gulp.task('make', 'Compile coffeescript files', function() {
  gulp.src(paths.app)
    .pipe(sourcemaps.init())                            // Genero le source maps
    .pipe(coffee({bare: true}).on('error', gutil.log))  // Compilo coffeescript
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./www/js/'));
});

gulp.task('make:prod', 'Compile coffeescript files for production', function() {
  gulp.src(paths.app)
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('./www/dist/js/'));
});

gulp.task('jade', 'Compile templates into html', function () {
  gulp.src(paths.template)
    .pipe(jade())
    .pipe(gulp.dest('./www/templates/'))
});

gulp.task('jade:prod', 'Compile templates into template.js for production', function() {
  gulp.src(paths.template)
    .pipe(jade())
    .pipe(ngTemplateCache({root: 'templates/'}))
    .pipe(gulp.dest('./www/dist/js/'));
});

gulp.task('style', 'Generate css style file', function() {
  gulp.src(paths.style)
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    .pipe(gulp.dest('./www/css/'));
});

gulp.task('sass', 'Generate ionic css file', function(done) {
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

gulp.task('watch', 'Watch for edits and recompile all above', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.app, ['make']);
  gulp.watch(paths.template, ['jade']);
  gulp.watch(paths.style, ['style']);
});

gulp.task('serve', 'Serve `www` on localhost:3000', serve('./www/'));

gulp.task('build',      'Compile everything for development', ['sass', 'make', 'jade', 'style']);
gulp.task('build:prod', 'Compile everything for production',  ['sass', 'make:prod', 'jade:prod', 'style']); // todo: add `style:prod`

gulp.task('install', 'Install bower components', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', 'Check for git', function(done) {
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
