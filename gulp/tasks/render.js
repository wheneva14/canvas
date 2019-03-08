const path = require("path");
const cwd = process.cwd();
const config = require("config");

const gulp = require("gulp");
const gulpCopy = require("gulp-copy");
const file = require("gulp-file");
const data = require("gulp-data");
const pugRender = require("gulp-pug");
const inject = require("gulp-inject");
const rename = require("gulp-rename");
const gulpif = require("gulp-if");
const sequence = require("run-sequence");
const series = require("stream-series");
const request = require("ajax-request");
const fs = require("fs");
let changedPath = "";

const {
  configEnv,
  configCompile,
  configSettings,
  methods,
  injectMode,
  devConfig,
  seoEnv
} = config;

const { articalAPIDomain, articalAPIFilename } = seoEnv;

const chalk = require("chalk");

const {
  isUseGoogleSpreadsheet,
  isUpdateGoogleSpreadsheetData,
  isRenderArticle,
  isMultiLanguage,
  googleSpreadsheetId
} = configSettings;

const { RenderGoogleSpreadsheet } = require("./render/index");

const languageAll = isMultiLanguage ? configSettings.languageAll : ["default"];

const _ = require("lodash");
const { NODE_ENV: env } = process.env;

function createRenderTask(payload = {}) {
  const { isMultiLanguage = false } = configSettings;

  const {
    dataInject,
    languageAll = ["default"],
    resolve = () => {},
    getArticleResult
  } = payload;

  return languageAll.map((language, languageIdx) => {
    const taskName = "template:" + language;

    gulp.task(taskName, done => {
      const srcAll = [path.join(cwd, configCompile.pugPageSrc)];

      const articlePath = configCompile.pugArticleSrc;

      const pathDest = isMultiLanguage
        ? path.join(cwd, configCompile.pathGulpCompiled, "html", language)
        : path.join(cwd, configCompile.pathGulpCompiled, "html");

      const dataDefault = {
        env,
        seoEnv,
        language,
        configCompile
      };

      const renderList = new Array();

      if (getArticleResult && getArticleResult.length)
        getArticleResult.map(article => {
          renderList.push({
            src: path.join(cwd, articlePath, article.articleWrap),
            data: _.merge({}, dataDefault, dataInject, { article: article }),
            suffix: article.id
          });
        });

      renderList.push({
        src: changedPath.length > 0 ? changedPath : srcAll,
        data: _.merge({}, dataDefault, dataInject),
        suffix: ""
      });

      return Promise.all(
        renderList.map(task => {
          return new Promise(resolve => {
            gulp
              .src(task.src)
              .pipe(
                data(file => {
                  return task.data;
                })
              )
              .pipe(
                pugRender({
                  pretty: "    "
                })
              )
              .pipe(
                rename({
                  suffix: task.suffix
                })
              )
              .pipe(gulp.dest(pathDest))
              .on("end", resolve);
          });
        })
      ).then(resolve);
    });

    return taskName;
  });
}

const initRenderTask = () => {
  let update_template_promise;
  if (isUseGoogleSpreadsheet) {
    update_template_promise = updateTemplateDataLanguageAll({
      languageAll,
      isUseGoogleSpreadsheet,
      isUpdateGoogleSpreadsheetData
    });
  } else {
    update_template_promise = Promise.resolve();
  }

  if (isUseGoogleSpreadsheet || isRenderArticle) {
    return update_template_promise
      .then(templateDataResponseAll => {
        return getTemplateDataLanguageAll();
      })
      .then(templateDataLocalResponseAll => {
        return Promise.all(
          languageAll.map((language, languageIdx) => {
            const {
              googleSpreadsheetDataLocal,
              getArticleResult
            } = templateDataLocalResponseAll[languageIdx];

            const promise$ = new Promise((resolve, reject) => {
              let dataInject;
              if (isUseGoogleSpreadsheet) {
                dataInject = googleSpreadsheetDataLocal.dataParsed;
              }

              createRenderTask({
                resolve,
                languageAll: [language],
                dataInject,
                getArticleResult
              }).map(taskName => {
                gulp.start(taskName);
              });
            });

            return promise$;
          })
        );
      });
  } else if (isRenderArticle) {
  } else {
    // no google (fix)
    const promiseAll = languageAll.map((language, lanugageIdx) => {
      const promise$ = new Promise((resolve, reject) => {
        createRenderTask({
          resolve,
          languageAll: [language]
        }).map(taskName => {
          gulp.start(taskName);
        });
      });

      return promise$;
    });
    return Promise.all(promiseAll);
  }
};

const getArticle = language => {
  return new Promise((resolve, reject) => {
    resolve(
      JSON.parse(
        fs.readFileSync(`${articalAPIDomain}${language}${articalAPIFilename}`)
      )
    );
    // request({
    //   url: `${articalAPIDomain}${language}${articalAPIFilename}`,
    //   method: 'GET',
    // }, function(err, res, body) {
    //  resolve(JSON.parse(body));
    // });
  });
};

const getTemplateDataLanguageAll = () => {
  return Promise.all(
    languageAll.map((language, languageIdx) => {
      return Promise.all([
        ...(isUseGoogleSpreadsheet
          ? [
              RenderGoogleSpreadsheet.getGoogleSpreadsheetDataParsedLocal({
                language
              }).then(response => {
                const { dataParsed } = response;
                return { dataParsed };
              })
            ]
          : [{}]),
        ...(isRenderArticle
          ? [
              getArticle(language).then(response => {
                return response;
              })
            ]
          : [{}])
      ]).then(([googleSpreadsheetDataLocal, getArticleResult]) => {
        return {
          googleSpreadsheetDataLocal,
          getArticleResult
        };
      });
    })
  );
};

const updateTemplateDataLanguageAll = () => {
  let preUpdateTemplateData$;
  let updateTemplateDataAll$;
  let getTemplateDataAll$;

  if (isUseGoogleSpreadsheet && isUpdateGoogleSpreadsheetData) {
    preUpdateTemplateData$ = getAuth().then(response => {
      const { token, oAuth2Client } = response;

      return {
        token,
        oAuth2Client
      };
    });
  } else {
    preUpdateTemplateData$ = Promise.resolve({});
  }

  updateTemplateDataAll$ = Promise.all(
    languageAll.map((language, lanugageIdx) => {
      return preUpdateTemplateData$
        .then(response => {
          if (isUseGoogleSpreadsheet && isUpdateGoogleSpreadsheetData) {
            const { token, oAuth2Client } = response;

            return updateTemplateData({
              token,
              oAuth2Client,
              language,
              isUseGoogleSpreadsheet,
              isUpdateGoogleSpreadsheetData
            });
          } else {
            return updateTemplateData({
              language,
              isUseGoogleSpreadsheet,
              isUpdateGoogleSpreadsheetData
            });
          }
        })
        .catch(err => {
          console.log(chalk.red("ERROR: GET TEMPLATE DATA"));
          throw err;
          // reject(err);
        });
    })
  );

  return updateTemplateDataAll$;
};

function updateTemplateData({
  isUseGoogleSpreadsheet,
  isUpdateGoogleSpreadsheetData,
  isUseWordpressApi = false,
  isUpdateWordpressApiData = false,
  language,
  token,
  oAuth2Client
}) {
  if (isUpdateGoogleSpreadsheetData && isUseGoogleSpreadsheet)
    return RenderGoogleSpreadsheet.getSpreadsheetDataRemote({
      googleSpreadsheetId: configSettings.googleSpreadsheetId,
      sheetName: language,
      token,
      oAuth2Client,
      language
    });
  else return;
}

const getAuth = (payload = {}) => {
  return RenderGoogleSpreadsheet.getGoogleCredentialJson()
    .then(response => {
      const { dataGoogleCredential } = response;
      return RenderGoogleSpreadsheet.requestGoogleAuth({
        dataGoogleCredential
      });
    })
    .then(response => {
      const { token, oAuth2Client } = response;
      return {
        token,
        oAuth2Client
      };
    });
};

gulp.task("template", done => {
  return initRenderTask();
});

gulp.task("template:data:update", done => {
  return updateTemplateDataLanguageAll({
    languageAll,
    isUseGoogleSpreadsheet: true,
    isUpdateGoogleSpreadsheetData: true
  });
});

/**
 *** WATCH TASKS
 **/
gulp.task("template:watch", done => {
  const srcAll = [path.join(cwd, configCompile.pathSrc, "pug/**/*.pug")];

  ///*** DEP ***/ return gulp.watch(srcAll, ['nunjucks']);

  // gulp.watch(srcAll, ['template']);
  gulp.watch(srcAll, e => {
    changedPath = e.path.includes("pages") ? e.path : "";
    gulp.start("template");
  });

  done();
});

gulp.task("render:watch", ["template:watch"]);

module.exports = ["template"];
