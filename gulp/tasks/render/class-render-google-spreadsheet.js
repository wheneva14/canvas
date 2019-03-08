const config = require('config');
const {
    configEnv,
    configCompile,
    configSettings,
} = config;

const cwd = process.cwd();
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
// const requestPromise = require('request-promise');

const {google} = require('googleapis');

const {
    GoogleAuth,
    OAuth2Client,
} = require('google-auth-library');
const readline = require('readline');
const shelljs = require('shelljs');

const scopeGoogleApisAll = ['https://www.googleapis.com/auth/spreadsheets'];

const googleSpreadsheetSheetNameMap = {
    zh_tw: 'zh_tw',
    zh_cn: 'zh_cn',
    en: 'en',
};

class RenderGoogleSpreadsheet {

    static writeGoogleRecord(payload = {}) {
        const promise$ = new Promise(async (resolve, reject) => {
            const {
                oAuth2Client: auth,
                developer,
            } = payload;

            const gs = google.sheets('v4');


            function update() {
                return gs.spreadsheets.batchUpdate({
                    "spreadsheetId": "178C6vFKpbDYzNcCLN3m9JtuqzLh430INxo3bcY3cefg",
                    auth,
                    resource: {
                        "requests": {
                            "addSheet": {
                                "properties": {
                                    "title": configSettings.project,
                                }
                            }
                        },
                    }
                });
            };

            // ingore exist sheet error
            try {
                await update()
            } catch (e) {
            }

            gs.spreadsheets.values.append({
                auth,
                // spreadsheetId: googleSpreadsheetId,
                // range: sheetName + '!A1',
                "spreadsheetId": "178C6vFKpbDYzNcCLN3m9JtuqzLh430INxo3bcY3cefg",
                "range": configSettings.project + "!A1",
                "includeValuesInResponse": "true",
                "responseDateTimeRenderOption": "FORMATTED_STRING",
                "responseValueRenderOption": "FORMATTED_VALUE",
                "valueInputOption": "USER_ENTERED",
                "resource": {
                    "range": configSettings.project + "!A1",
                    "values": [
                        [
                            new Date().toString(),
                            configSettings.sitemapDomain,
                            developer,
                            auth._clientId,
                        ],
                    ]
                },
            }, (err, response) => {

                if (err) {
                    console.log(chalk.red('ERROR: UPDAED GOOGLE SPREADSHEET DATA'));
                    reject(err);
                } else {

                    ///*** DEP ***/ const {values: dataInRowAll} = response;
                    // const {values: dataInRowAll} = response.data;
                    // console.log(response.data)
                    // const dataParsed = this.parseGoogleSpreadsheetData({ dataInRowAll });

                    console.log(chalk.green('SUCCESS: UPDAED GOOGLE SPREADSHEET DATA'));


                }
            })

        });

        return promise$;

    }


    static getGoogleCredentialJson () {
        const promise$ = new Promise((resolve, reject) => {
            // const pathSrc = path.join(cwd + '/' + configSettings.pathGoogleCredentialJson);
            const pathSrc = configSettings.pathGoogleCredentialJson;

            fs.readFile(pathSrc, (err, data) => {
                if (err) {
                    console.log(chalk.red('SUCCESS: GET GOOGLE CREDENTIAL'));
                    reject({err});
                } else {
                    console.log(chalk.green('SUCCESS: GET GOOGLE CREDENTIAL'));
                    resolve({dataGoogleCredential: JSON.parse(data)});
                }

            })        

        });

        return promise$;
    }

    static requestGoogleAuth (payload = {}) {
        const promise$ = new Promise((resolve, reject) => {
            const {dataGoogleCredential: data} = payload;
            
            const {
                client_secret: clientSecret,
                client_id: clientId,
                redirect_uris: [redirectUrl],
            } = data.installed;

            const auth = new GoogleAuth();

            // const oAuth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
            const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);

            fs.readFile(configSettings.pathOAuth2Token, (err, data) => {
                if (err) {
                    // reject({err});
                    this.requestOAuth2Token({ oAuth2Client })
                        .then((response) => {
                            const {token} = response;

                            console.log(chalk.green('SUCCESS: REQUEST OAUTH2 TOKEN + GOOGLE AUTH'));

                            oAuth2Client.credentials = token;

                            resolve({ token, oAuth2Client });
                        })
                        .catch((err) => {
                            console.log(chalk.red('ERROR: REQUEST GOOGLE AUTH'));
                            reject({err});
                        });

                } else {
                    const token = JSON.parse(data);

                    console.log(chalk.green('SUCCESS: REQUEST GOOGLE AUTH'));

                    oAuth2Client.credentials = token;

                    resolve({ token, oAuth2Client });
                }
            })


        });

        return promise$;
    }

    static requestOAuth2Token (payload = {}) {
        const promise$ = new Promise((resolve, reject) => {
            const {oAuth2Client} = payload;

            const urlAuth = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopeGoogleApisAll,
            });

            console.log(chalk.blue('GET AUTHORIZATION VIA THIS URL: ', urlAuth));

            const readlineCodeInput = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            
            readlineCodeInput.question('ENTER THE CODE: ', (input) => {
                readlineCodeInput.close();

                oAuth2Client.getToken(input, (err, token) => {
                    if (err) {
                        console.log(chalk.red('RETRIEVE ACCESS TOKEN FAIL:'));
                        console.log(err);

                        reject({ errormsg: 'REQUEST OAUTH2 TOKEN FAIL'});

                    } else {
                        console.log(chalk.green('RETRIEVE ACCESS TOKEN SUCCESS'));

                        this.writeOAuth2Token({ token });

                        resolve({ token });

                    }
                })
            });

        });

        return promise$;

    }


    static writeOAuth2Token (payload = {}) {
        const {token} = payload;
        const tokenJson = JSON.stringify(token);

        const isDirTokenExists = fs.existsSync(configSettings.pathOAuth2TokenDir);

        if (!isDirTokenExists) {
            shelljs.mkdir('-p', configSettings.pathOAuth2TokenDir)
            ///*** DEP ***/ fs.mkdirSync(configSettings.pathOAuth2TokenDir);
        }

        fs.writeFileSync(configSettings.pathOAuth2Token, tokenJson);

        console.log('TOKEN SAVED: ', configSettings.pathOAuth2Token);
    }

    static getSpreadsheetDataRemote (payload = {}) {
        const promise$ = new Promise((resolve, reject) => {
            const {
                oAuth2Client: auth,
                language,
                googleSpreadsheetId,
                sheetName = googleSpreadsheetSheetNameMap[language],
            } = payload;

            const gs = google.sheets('v4');
            ///*** DEP ***/ const sheetName = googleSpreadsheetSheetNameMap[language];

            gs.spreadsheets.values.get({
                auth,
                spreadsheetId: googleSpreadsheetId,
                range: sheetName + '!B1:Z',
            }, (err, response) => {

                if (err) {
                    console.log(chalk.red('ERROR: GET REMOTE GOOGLE SPREADSHEET DATA'));
                    reject(err);
                } else {

                    ///*** DEP ***/ const {values: dataInRowAll} = response;
                    const {values: dataInRowAll} = response.data;

                    const dataParsed = this.parseGoogleSpreadsheetData({ dataInRowAll });

                    this.writeGoogleSpreadsheetDataParsedLocal({
                        language,
                        data: dataParsed,
                    })
                        .then(({data}) => {
                            
                            resolve({ data: dataParsed });

                        })

                    console.log(chalk.green('SUCCESS: GET REMOTE GOOGLE SPREADSHEET DATA'));


                }
            })

        });

        return promise$;

    }

    static writeGoogleSpreadsheetDataParsedLocal ({
        data,
        language,
    }) {
        const jsonPretty = JSON.stringify(data, null, 2);
        const pathJsonWriteDir = path.resolve(cwd, configSettings.pathGoogleSpreadsheetDataJsonDir);
        const pathJsonWrite = path.resolve(pathJsonWriteDir, language + '.json');
    
        const mkdir$ = new Promise((resolve, reject) => {

            mkdirp(pathJsonWriteDir, (err) => {
                if (err) {reject();}
                fs.writeFileSync(pathJsonWrite, jsonPretty);

                console.log(chalk.green('SUCCESS: WRITE GOOGLE SPREADSHEET DATA'));
                resolve({data});
            });

        });

        return mkdir$;
    }

    static getGoogleSpreadsheetDataParsedLocal ({
        language,
    }) {
        const pathJsonReadDir = path.resolve(cwd, configSettings.pathGoogleSpreadsheetDataJsonDir);
        const pathJsonRead = path.resolve(pathJsonReadDir, language + '.json');

        console.log(chalk.green('SUCCESS: GET GOOGLE SPREADSHEET DATA LOCAL'));

        return Promise.resolve({
            dataParsed: JSON.parse(fs.readFileSync(pathJsonRead)),
        })
        
    }

    static parseGoogleSpreadsheetData (payload = {}) {
        const {dataInRowAll: data} = payload;

        let dataParsed = {};

        data.map((row, rowIdx) => {
            const propName = row[0];

            if (propName !== '' && typeof propName !== 'undefined') {
                if (row.length > 2 ) {
                    dataParsed[propName] = row.slice(1);
                } else if (row.length === 2) {
                    dataParsed[propName] = row[1];
                } else {
                    dataParsed[propName] = '';
                }
            }
            
        });

        return dataParsed;
    }

}

module.exports = {
    RenderGoogleSpreadsheet,
};