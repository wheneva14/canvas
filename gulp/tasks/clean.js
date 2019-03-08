const path = require('path');
const cwd = process.cwd();
const config = require('config');
const {
    configEnv,
    configCompile,
    configSettings,
} = config;

const gulp = require('gulp');
const rimraf = require('gulp-rimraf');


gulp.task('clean:dist', (done) => {
	return gulp.src(path.resolve(cwd, configCompile.pathDest), { read: false })
		.pipe(rimraf({ force: true }));
});

gulp.task('clean:compiled', (done) => {
   
	return gulp.src(path.resolve(cwd, configCompile.pathGulpCompiled), { read: false })
		.pipe(rimraf({ force: true }));

});

module.exports = [
    'clean:dist',
    'clean:compiled',
];
