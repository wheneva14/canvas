const { 
	NODE_ENV: env ,
    NODE_DEV_INJECT_MODE: injectMode = 'webpack',
    NODE_DEV_OUTPUT_MODE: outputMode = 'memory',
    NODE_DEV_HOST: devHost = 'localhost',
    NODE_DEV_PORT: devPort = 8080,
} = process.env;
const path = require('path');
const cwd = process.cwd();

// 使用Redifined的env回傳NODE_ENV
const envVar = Object.create(null);
envVar.env = env;

const compileVar = {
	pathSrc 			: 	'src',
	pathDest			: 	'dist',
	pathGulpCompiled 	: 	'gulp-compiled',
	pathCSS				: 	[
		path.join(cwd, 'src/scss/style.scss'),
	],
	svgCssPath			: 	path.join(cwd, 'gulp-compiled/css/ac-font.css'),
	pugPageSrc			: 	'src/pug/pages/**/*.pug',
	pugEntries 			:   [
		'index.html'
	],
	pugArticleSrc		: 	'src/pug/article/',
	styleOutputFolder	: 	'cssDest',
	styleOutput			: 	'style-concat',
	templateJSFolder 	: 	'js',
	templateJS			: 	[
		'core.min.js',
		'script.js'
	],
	templateJSDist 		: 	'/common/js',
	fontPath			: 	'../fonts/',
}

// PATH及RENDER設定
const settingVar = {
	sitemapDomain						: 	'xxxx',
	project								: 	'fwk_mpa_parcel',
	isUseGoogleSpreadsheet 				: 	false,
	isUpdateGoogleSpreadsheetData 		: 	false,
	isRenderArticle						: 	false,
	isMultiLanguage 					: 	true,
	clearParcelData						: 	true,
	languageAll							: 	[
		'zh_tw'
	],
	filenameOAuth2Token					: 	'sheets.googleapis.com-nodejs-oauth2-token.json',
	pathOAuth2TokenDir					: 	path.join(cwd, '/.credentials/oauth2/'),
	filenameGoogleCredentialJson 		: 	'google_id.json',
	pathGoogleCredentialJsonDir			: 	path.join(cwd, '/.credentials/'),
	googleSpreadsheetId 				: 	'10jmNS8fIKwaLYHzO6gtwalE7hF6Zy-nE_dXRkW6xMtg',
    pathGoogleSpreadsheetDataJsonDir	: 	path.join(cwd, 'src/json/google-spreadsheet'),
  
}
settingVar.pathOAuth2Token = path.join(settingVar.pathOAuth2TokenDir, settingVar.filenameOAuth2Token);
settingVar.pathGoogleCredentialJson = path.join(settingVar.pathGoogleCredentialJsonDir, settingVar.filenameGoogleCredentialJson);



module.exports = {
	configEnv		: 	envVar,
	configCompile	: 	compileVar,
	configSettings	: 	settingVar,

}