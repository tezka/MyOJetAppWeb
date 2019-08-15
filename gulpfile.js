var config = require('./gulp-config');
var gulp = require('gulp');
var git = require('git-rev');
var war = require('gulp-war');
var zip = require('gulp-zip');
var del = require('del');
var exec = require('child_process').exec;


function package() {
  return gulp.src([config.build.root + '**'])
    .pipe(war({
      welcome: 'index.html',
      displayName: config.displayName
    }))
    .pipe(zip(config.appName + '.war'))
    .pipe(gulp.dest(config.release.root));
};


function copyWebInf() {
  return gulp.src(config.webInf)
    .pipe(gulp.dest(config.build.webInf));
}


function clean(path) {
  return del([path], {
    force: true
  });
}

function cleanBuild() {
  return clean(config.build.root + "**/*");
}

function cleanRelease() {
  return clean(config.release.root + "**/*");
};


function build(cb) {
  exec('ojet build', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

// gulp.task("release", gulp.series(['cleanRelease', 'copyWebInf', 'war']));

gulp.task("build", gulp.series(cleanBuild, build));
gulp.task("release", gulp.series(cleanBuild, cleanRelease, build, copyWebInf, package));
