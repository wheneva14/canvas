/* Project Deployment v1.3 */
/* Install */
/* For first Time, Install all stack globally */
/*     npm install gulp gulp-sftp gulp-batch-replace gulp-sequence gulp-clean gulp-prompt gulp-ignore gulp-ssh yargs -g */
/* Or */
/* Just Link up the required module from global */
/*     npm link gulp gulp-sftp gulp-batch-replace gulp-sequence gulp-clean gulp-prompt gulp-ignore gulp-ssh yargs */

const gulp = require('gulp');
const sftp = require('gulp-sftp');
const config = require('config');
const replace = require('gulp-batch-replace');
const seq = require('gulp-sequence');
const clean = require('gulp-clean');
const prompt = require('gulp-prompt');
const ignore = require('gulp-ignore');
const GulpSSH = require('gulp-ssh')
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const cwd = process.cwd();

const sequence = require('run-sequence'); // 創造Asynchronous Stack
sequence.options.ignoreUndefinedTasks = true;

const {
    RenderGoogleSpreadsheet,
} = require('./render/index');


const {
    configCompile,
    configSettings,
    seoEnv,
    configEnv,
} = config;


const data = seoEnv.deployData;

var developer = "";

gulp.task('deploy_question_env', function() {

	return gulp.src(path.resolve(cwd, 'gulpfile.js'))
        .pipe(prompt.prompt({
            type: 'input',
            name: data.project,
            message: 'update ' + configEnv.env + ' ?(Y/N)',
            // default: data.version,
            validate: function(input) {
                return input.match(/Y|y/) && input != null;
            }
        }, function(res) {
	        
        	console.log("SUCCESS")
            console.log(res);
        }));
});




gulp.task('deploy_question_developer', function(){
	if (configEnv.env == "prod") {
		return gulp.src(path.resolve(cwd, 'gulpfile.js' ))
			.pipe(prompt.prompt({
				type: 'input',
				name: data.project,
				message: 'Type your name!!',
				default: data.version,
				validate: function(input){
					developer = input;
					return input != null && input !== "";
				}
			})
			, function(res){
				console.log('success');
			});
	} else{
		return;
	}
});

// var replace_tasks = [];
// for(var i = 0; i < data.replace.length; i++){
// 	console.log('data.replace')
// 	var item = data.replace[i];
// 	var task_name = 'deploy_replace_' + i;
	
// 	gulp.task(task_name, (function(item){
// 		var file_path = item.file.split("/");
// 		file_path.pop();
// 		return function(){
// 			return gulp.src(path.resolve(cwd) + item.file)
// 				// .pipe(replace(item.rule))
// 				.pipe(gulp.dest(path.resolve(cwd, configCompile.pathDest) + "/tmp/") + file_path.join("/"));
// 		}
// 	})(item));
// 	replace_tasks.push(task_name);
// }


gulp.task('deploy_tmp', function() {
    var uploadSrc = [];

    data.source.forEach((item, index, array) => {
        if (item[0] == "!") {
            item = item.substr(1);
            uploadSrc.push('!' + path.resolve(cwd, configCompile.pathDest, item));
        } else {
            uploadSrc.push(path.resolve(cwd, configCompile.pathDest, item));
        }

    });


    return gulp.src(uploadSrc).pipe(gulp.dest(path.resolve(cwd, configCompile.pathDest) + "/tmp/"));
});



gulp.task('deploy_send', function() {
    return gulp.src(cwd + '/' + configCompile.pathDest + '/tmp/**/*')
        .pipe(sftp({
            host: data.host,
            user: data.user,
            pass: data.pass,
            port: 22,
            remotePath: data.target,
            remotePlatform: 'unix',
        }));
});

gulp.task('deploy_clean', function() {
    return gulp.src(cwd + '/' + configCompile.pathDest + '/tmp/', { read: false })
        .pipe(clean({ force: true }));
});


gulp.task('updateRecord', function() {
    if (configEnv.env == "prod")
        return updateRecord(developer);
    else
        return;
});


const getAuth = (payload = {}) => {
    return RenderGoogleSpreadsheet.getGoogleCredentialJson()
        .then((response) => {
            const { dataGoogleCredential } = response;
            return RenderGoogleSpreadsheet.requestGoogleAuth({ dataGoogleCredential });
        })
        .then((response) => {
            const { token, oAuth2Client } = response;
            return {
                token,
                oAuth2Client,
            };
        });
}



function updateRecord(developer) {
    let updateGoogleDocs;

    updateGoogleDocs = getAuth()
        .then((response) => {
            const {
                token,
                oAuth2Client,
            } = response;


            return RenderGoogleSpreadsheet.writeGoogleRecord({
                token,
                oAuth2Client,
                developer,
            });
        })
}


module.exports = [
    'deploy_question_env',
    'deploy_question_developer',
    'deploy_tmp',
    'deploy_send',
    'deploy_clean',
    'updateRecord'
];