const Koa = require('koa');
const cors = require('koa2-cors');
const koaBody = require('koa-bodyparser');
const fs = require('fs-extra');
const path = require('path');

const formatResponse = require('./Middleware/formatResponse');
const { apiRouter, genAPIPath } = require('./Middleware/APIRouter');
// const genInitData  = require('./utils/genInitData');

const [, scriptpath, filePath = 'build.json', port = 8080] = process.argv;
const app = new Koa();
const dbPath = path.join(path.dirname(scriptpath), 'temp');
const dbFilePath = path.join(dbPath, 'db.json');

fs.readJson(filePath)
  .then(jsonData => {
    const { crudAPI, createAPI, formFields } = jsonData;
    const api = crudAPI || createAPI;
    // const dbData = genInitData(formFields);
    return fs.remove(dbPath)
      .then(_ => fs.ensureDir(dbPath))
      .then(_ => fs.writeJson(dbFilePath, []))
      .then(_ => Promise.resolve(api))
  })
  .then(api => {

    app.use(cors({
      exposeHeaders: ['Content-Disposition'],
    }));
    app.use(formatResponse);
    app.use(koaBody());
    app.use(genAPIPath(api, dbFilePath)).use(apiRouter.allowedMethods());

    app.on('error', (err, ctx) => {
      console.warn(err.message);
    });

    console.log(`mock server listen port to ${port}`);
    console.log(`CRUD API:`, api);

    app.listen(port);
  });


