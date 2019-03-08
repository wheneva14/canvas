const async = require('async');
const path = require('path');
const cwd = process.cwd();
const config = require('config');
const fs = require('fs');
const gulp = require('gulp');

const iconfont = require('gulp-iconfont');
const consolidate = require('gulp-consolidate');
const runTimestamp = Math.round(Date.now()/1000);


const {
    configEnv,
    configCompile,
    configSettings,
} = config;

gulp.task('iconfont', (done) => {
    const pathSrc =  path.join(cwd, configCompile.pathSrc, 'fonts/icons/*.svg');

      var iconStream = gulp.src(pathSrc)
        .pipe(iconfont({
            normalize:true,
            fontName: 'ac-font', // required
            formats: ['ttf', 'eot', 'woff'], // default, 'woff2' and 'svg' are available
       }))
     
       async.parallel([
        function handleGlyphs (cb) {
          iconStream.on('glyphs', function(glyphs, options) {
            gulp.src('src/fonts/template/ac-font.css')
              .pipe(consolidate('lodash', {
                glyphs: glyphs,
                fontName: 'ac-font',
                fontPath:  configCompile.fontPath,
                className: 'ac'
              }))
              .pipe(gulp.dest('gulp-compiled/css/'))
              .on('finish', cb);

          });

        },
        function handleFonts (cb) {
          iconStream
            .pipe(gulp.dest('gulp-compiled/fonts'))
            .on('finish', cb);
        }
      ], done);
});

gulp.task('iconfont:watch', function () {
    return gulp.watch(srcAll, ['gulp-font']);
});

module.exports = [
    'iconfont',
];
