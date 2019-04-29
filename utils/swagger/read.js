
const program = require('commander');
const fs = require('fs-extra');
const fsExtra = require('fs-extra');
const path = require('path');
const format = require('./format');
const shell = require('shelljs');

module.exports = function read(API) {
  const swaggerFilePath = path.resolve(program.swagger);
  const swaggerFormatPath = `${path.dirname(swaggerFilePath)}/format.json`;
  return new Promise((res, rej) => {
    if (API === undefined) {
      rej('请传入需要读取的 API');
    }
    if (!fs.existsSync(swaggerFormatPath)) {
      format().then(() => {
        readAPI(swaggerFormatPath, API).then(res).catch(rej);
      })
    } else {
      readAPI(swaggerFormatPath, API).then(res).catch(rej);
    }
  }).catch((err) => {
    return err;
  });

}

function readAPI(swaggerFormatPath, API) {
  return fsExtra.readJSON(swaggerFormatPath).then((jsonData) => {
    const match = jsonData[API];
    if (match) {
      return match;
    } else {
      throw new Error(`未能在 format.json 里面找到 ${API} 相关的数据`);
    }
  });
}