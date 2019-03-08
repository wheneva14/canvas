process.env["FORCE_COLOR"] = 0;

const path = require("path");
const cwd = process.cwd();
const config = require("config");
const chalk = require("chalk");
const gulp = require("gulp");
const parcel = require("gulp-parcel");
const Path = require("path");
const rename = require("gulp-rename");
const fs = require("fs");
const replace = require("gulp-replace");

const file = require("gulp-file");
const { configCompile, configSettings, seoEnv } = config;
const clear = require("cli-clear");
let cacheDir = new Date().getTime();

const moveGulpJS = () => {
  return Promise.all(
    configSettings.languageAll.map(language => {
      gulp
        .src(
          path.join(
            cwd,
            configCompile.pathSrc,
            configCompile.templateJSFolder,
            "sw.js"
          )
        )
        .pipe(gulp.dest(path.join(cwd, configCompile.pathDest, language)));

      return new Promise((resolve, reject) => {
        gulp
          .src(path.join(cwd, configCompile.pathSrc, "/js/**/*"))
          .pipe(
            gulp.dest(
              path.join(cwd, configCompile.pathGulpCompiled, "html", "/js/")
            )
          )
          .on("finish", resolve);
      });
    })
  );
};

const moveLanguageJson = () => {
  let datas = {};
  Promise.all(
    configSettings.languageAll.map(language => {
      let data = JSON.parse(
        fs.readFileSync(
          path.join(
            cwd,
            configCompile.pathSrc,
            `/json/google-spreadsheet/${language}.json`
          )
        )
      );
      datas[language] = data;
    })
  ).then(() => {
    return new Promise((resolve, reject) => {
      gulp
        .src([""])
        .pipe(
          fs.writeFile(
            path.join(
              cwd,
              configCompile.pathGulpCompiled,
              "html",
              "/js/language.json"
            ),
            JSON.stringify(datas),
            resolve
          )
        );
    });
  });
};

const createParcelTask = async () => {
  for (const [lidx, language] of Object.entries(configSettings.languageAll)) {
    for (const [pidx, item] of Object.entries(configCompile.pugEntries)) {
      const pugEntries = `${
        configCompile.pathGulpCompiled
      }/html/${language}/**/${item}`;
      await new Promise(resolve => {
        gulp
          .src(pugEntries, { read: false })
          .pipe(
            parcel(
              {
                outDir: `${configCompile.pathDest}/${language}/`,
                publicURL: "./",
                cacheDir: `.cache/${
                  cacheDir ? cacheDir : new Date().getTime()
                }`,
                contentHash: "disable",
                production: false,
                watch: false,
                logLevel: 3,
                killWorkers: true,
                cache: seoEnv.cache
              },
              { source: "build" }
            )
          )
          .on("finish", resolve);
      });
    }
  }
};

gulp.task("parcel:build", done => {
  if (configCompile.clearParcelData) clear();

  return Promise.resolve()
    .then(() => {
      return moveGulpJS();
    })
    .then(() => {
      return moveLanguageJson();
    })
    .then(() => {
      return createParcelTask();
    });
});

// gulp.task('parcel:build:watch', (done) => {
// 	return gulp.watch([`${configCompile.pathGulpCompiled}/**/*.html`,`${configCompile.pathGulpCompiled}/${configCompile.styleOutputFolder}/**/*`,`src/js/**/*`], [`parcel:build`]);

// });
gulp.task("parcel:build:watch", done => {
  return gulp.watch(
    [
      `${configCompile.pathGulpCompiled}/**/*.html`,
      `${configCompile.pathGulpCompiled}/${
        configCompile.styleOutputFolder
      }/**/*`,
      `src/js/**/*`
    ],
    [`injectTemplateJS`]
  );
});

gulp.task("injectTemplateJS", ["parcel:build", "moveTemplateJS"], done => {
  let stringReplace = [];

  console.log("############inect###########");

  configCompile.templateJS.forEach(jsSrc => {
    stringReplace.push(
      `<script type="text/javascript" src="..${
        configCompile.templateJSDist
      }/${jsSrc}"></script>`
    );
  });

  return gulp
    .src([path.join(cwd, configCompile.pathDest, "/**/*.html")])
    .pipe(replace(/\<injectJS\>\<\/injectJS\>/g, stringReplace.join("")))
    .pipe(gulp.dest(path.join(cwd, configCompile.pathDest)));
});

gulp.task("moveTemplateJS", done => {
  let templateJS = [];

  configCompile.templateJS.forEach(jsSrc => {
    templateJS.push(
      path.join(
        cwd,
        configCompile.pathSrc,
        configCompile.templateJSFolder,
        jsSrc
      )
    );
  });

  return gulp
    .src(templateJS)
    .pipe(
      gulp.dest(
        path.join(cwd, configCompile.pathDest, configCompile.templateJSDist)
      )
    );
});

module.exports = ["parcel:build", "parcel:build:watch"];
