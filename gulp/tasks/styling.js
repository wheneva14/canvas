const path = require('path');
const cwd = process.cwd();
const config = require('config');

const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');

const tildeImporter = require('node-sass-tilde-importer');
const sourcemaps = require('gulp-sourcemaps');

const {
    configEnv,
    configCompile,
    configSettings,
} = config;

const { pathSrc, pathGulpCompiled:pathDest, pathCSS:srcAll } = configCompile;

gulp.task('scss', (done) => {
    console.log('##########run scss############')
    return gulp.src(srcAll)
        .pipe(sourcemaps.init({
        }))
        .pipe(sass({
            importer: tildeImporter,
             includePaths: [
            './gulp-compiled/css/', 
        ],
        }).on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.join(cwd, pathDest, 'css')));
});

gulp.task('scss:watch', function () {
    let watcher = gulp.watch(path.join(cwd, configCompile.pathSrc, 'scss/**/*.scss'));
    watcher.on('change', function(event) {
        console.log('on watch change')
        gulp.start('scss');
    });
    // return gulp.watch(path.join(cwd, configCompile.pathSrc, 'scss/**/*.scss'), ['scss']);
    
});

gulp.task('styling:watch', [
    'scss:watch',
]);

module.exports = [
    'scss',
];
