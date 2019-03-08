const uatEnv = {
	renderSitemap		: 	true,
	robotUserAgent		: 	'*',
	robotAllow			: 	['*'],
	robotDisallow		: 	[''],
	articalAPIDomain	: 	'./article/',
	articalAPIFilename	: 	'/api.json',
	miniyImg			: 	true,
	cache				:	false,
	deployData			: 	{
	    "project": "pracel",
	    "host": "10.10.10.213",
	    "user": "root",
	    "pass": "qwerasdfzxcv",
	    "source": [
	        "**/*",
	        "!testing.js"
	    ],
	    "target": "/home/wwwroot/parcel_mpa",
	},
}

module.exports = {
	seoEnv : uatEnv
};