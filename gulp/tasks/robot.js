const path = require('path');
const cwd = process.cwd();
const config = require('config');

const gulp = require('gulp');
const robots = require('gulp-robots');

const {
    seoEnv,
    configCompile,
} = config;


gulp.task('robots', function () {
    
  return gulp.src(path.join(cwd, configCompile.pathDest, 'sitemap.xml'))
        .pipe(robots({
            useragent: seoEnv.robotUserAgent,
            allow: seoEnv.robotAllow,
            disallow: seoEnv.robotDisallow
        }))
        .pipe(gulp.dest(path.join(cwd, configCompile.pathDest)));

});


module.exports = [
    'robots',
];
