const uatEnv = {
	renderSitemap 		: 	true,
	robotUserAgent		: 	'*',
	robotAllow			: 	[],
	robotDisallow		: 	['/'],
	articalAPIDomain	: 	'./article/',
	articalAPIFilename	: 	'/api.json',
	miniyImg			: 	false,
	cache				:	false,
	deployData			: 	{
	    "project": "pracel",
	    "host": "10.10.10.213",
	    "user": "root",
	    "pass": "qwerasdfzxcv",
	    "source": [
	        "**/*",
	    ],
	    "target": "/home/wwwroot/vccxTest",
	    "replace": [
	        {
	            "file": "/dist/zh_cn/index.html",
	            "rule": [
	                [
	                    "/api.json",
	                    "/api.json-uat"
	                ]
	            ]
	        },
	    ]
	},
	

}



module.exports = {
	seoEnv : uatEnv
};