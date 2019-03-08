process.env["FORCE_COLOR"] = 0;

const async = require('async');
const path = require('path');
const cwd = process.cwd();
const config = require('config');
const fs = require('fs');
const gulp = require('gulp');


const imagemin = require('gulp-imagemin');
const rename = require("gulp-rename");
const gulpif = require('gulp-if');

const {
    configEnv,
    configCompile,
    configSettings,
	seoEnv:compressOpt
} = config;
const languageAll =  configSettings.languageAll ;

const {
	miniyImg 
} = compressOpt;

const createImageTask = ()=>{
	const task = [];

	languageAll.map((language)=>{
		task.push({
			src: path.join(cwd, configCompile.pathSrc, 'images', language),
			dest: path.join(cwd, configCompile.pathGulpCompiled, '/images/', language)
		},{
		src: path.join(cwd, configCompile.pathSrc, 'images', 'common'),
		dest: path.join(cwd, configCompile.pathDest, language, '/images/')	
		});
	});

	task.push({
		src: path.join(cwd, configCompile.pathSrc, 'images', 'common'),
		dest: path.join(cwd, configCompile.pathGulpCompiled, '/images/')	
	},)


	task.push({
		src: path.join(cwd, configCompile.pathSrc, 'manifest'),
		dest: path.join(cwd, configCompile.pathGulpCompiled, '/manifest/')	
	},)

	return task;
}

gulp.task('minImage', (done) => {

	const task = createImageTask();

    return Promise.all(task.map((imageMove) => {

    	return new Promise((resolve)=>{ 
    		gulp.src(imageMove.src + '/**/*')
				.pipe(gulpif(miniyImg, imagemin({
					optimizationLevel  : 1,
				})))
		        .pipe(gulp.dest(imageMove.dest))
		        .on('end', resolve)
	    })

	}))

});


module.exports = [
    'minImage',
];
