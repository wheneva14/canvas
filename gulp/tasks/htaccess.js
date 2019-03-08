const path = require('path');
const cwd = process.cwd();
const config = require('config');

const gulp = require('gulp');
const concat = require('gulp-concat');

const {
    configEnv,
    configCompile,
    configSettings,
} = config;

gulp.task('moveHtaccess', (done) => {
    return Promise.all(configSettings.languageAll.map((language) => {
     const htaccessPath = `${configCompile.pathDest}/${language}/`;
     return gulp.src(path.join(cwd,'.htaccess'))
        .pipe(gulp.dest(path.join(cwd,htaccessPath)));
    }))
});


module.exports = [
    'moveHtaccess'
];
