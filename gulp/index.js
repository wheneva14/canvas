const gulp = require('gulp');
const path = require('path');
const glob = require('glob');
const cwd = process.cwd();
const taskAll = glob.sync(path.join(__dirname, 'tasks/*.js')).map((file) => {
    return path.basename(file);
});

module.exports = function(
	{
	    tasks = taskAll,
	} = {
	    tasks: taskAll,
	} 
) {

    tasks.forEach(function(name) {
        gulp.task(path.basename(name, '.js'), require('./tasks/' + name));
    });

    return gulp;
};
