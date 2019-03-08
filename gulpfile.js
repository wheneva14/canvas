const path = require('path');
const cwd = process.cwd(); //根檔案位置
process.env["NODE_CONFIG_DIR"] = path.resolve(cwd, 'gulp/config/'); //設置 nodejs config位置 cwd為root dir 加上config位置
const sequence = require('run-sequence'); // 創造Asynchronous Stack
sequence.options.ignoreUndefinedTasks = true;

const config = require('config'); // 於config folder索引自己設置的配置 預設檔案為default.js

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const {
    configEnv,
    configCompile,
    configSettings,
} = config;


const gulp = require('./gulp/index.js')();

gulp.task('dev', (done) => {
    sequence(
        [
            'clean:compiled',
            'clean:dist',
        ],
        [
            'iconfont',
            'styling'
        ],
        [
            'stylingConcate',
        ],
        [
            'render',
        ],
        [
            'minImage',
        ],
        [
            'moveHtaccess',
        ],
        [
            'injectTemplateJS',
        ],
        [
            'styling:watch',
            'render:watch',
            'stylingConcate:watch',
            'parcel:build:watch'
        ],
        // done
    );
});

gulp.task('build', (done) => {
    sequence(
        [
            'clean:compiled',
            'clean:dist',
        ],
        [
            'iconfont',
            'styling'
        ],
        [
            'stylingConcate',
        ],
        [
            'render',
        ],
        [
            'minImage',
        ],
        [
            'moveHtaccess',
        ],
        [
            'injectTemplateJS',
        ],
        [
            'sitemap',
        ],
        [
            'robot',
        ],
        done
    );
});


gulp.task('deploy_start', (done) => {
    sequence(
    // 'deploy_question_env',
    // 'deploy_question_developer',
    'build',
    'updateRecord',
    'deploy_tmp',
    'deploy_send',
    'deploy_clean',
    done);
});


