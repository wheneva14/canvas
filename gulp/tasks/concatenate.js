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

gulp.task('stylingConcate', (done) => {
    console.log('concatteXXXXXXXXXXXXXXXXXXXXXXXXX')
     return gulp.src([path.join(cwd, configCompile.pathGulpCompiled, '/css/*.css')])
    .pipe(concat(configCompile.styleOutput + '.css'))
    .pipe(gulp.dest(path.join(cwd, configCompile.pathGulpCompiled, configCompile.styleOutputFolder)));
});

gulp.task('stylingConcate:watch', ()=>{
	return gulp.watch([path.join(cwd, configCompile.pathGulpCompiled, '/css/*.css')], ['stylingConcate'])
});

module.exports = [
    'stylingConcate',
    'stylingConcate:watch'
];
