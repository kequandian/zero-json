
const program = require('commander');
const fs = require('fs-extra');
const fsExtra = require('fs-extra');
const path = require('path');
const format = require('./format');
const shell = require('shelljs');

module.exports = function read(API) {
  const swaggerFilePath = path.resolve(program.swagger);
  return new Promise((res, rej) => {
    if (API === undefined) {
      rej('请传入需要读取的 API');
    }
    if (!fs.existsSync(swaggerFilePath)) {
      format().then(() => {
        readAPI(swaggerFilePath, API).then(res).catch(rej);
      })
    } else {
      readAPI(swaggerFilePath, API).then(res).catch(rej);
    }
  }).catch((err) => {
    return err;
  });

}

function readAPI(swaggerFilePath, API) {
  return fsExtra.readJSON(swaggerFilePath).then((jsonData) => {
    const match = jsonData[API];
    if (match) {
      return match;
    } else {
      throw new Error(`未能在 format.json 里面找到 ${API} 相关的数据`);
    }
  });
}