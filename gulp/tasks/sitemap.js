const path = require('path');
const cwd = process.cwd();
const config = require('config');

const gulp = require('gulp');
const sitemap = require('gulp-sitemap');

const {
    seoEnv,
    configEnv,
    configCompile,
    configSettings,
} = config;


gulp.task('googleSitemap', function () {
    const sitemapSrc = path.join(cwd, configCompile.pathDest, '/**/*.html');

    if(seoEnv.renderSitemap)
        return gulp.src(sitemapSrc, {
                read: false
            })
            .pipe(sitemap({
                siteUrl: configSettings.sitemapDomain
            }))
            .pipe(gulp.dest(configCompile.pathDest));
});


module.exports = [
    'googleSitemap',
];
