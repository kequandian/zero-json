
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
    if (!fs.existsSync(swaggerFilePath)) {
      rej(new Error(`未能找到 swagger.json 文件: ${swaggerFilePath}`));
      return false;
    }

    if (!API) {
      rej('请传入需要读取的 API');
    }
    if (!fs.existsSync(swaggerFormatPath)) {
      return format().then(() => readAPI(swaggerFormatPath, API).then(res).catch(rej))
    } else {
      return readAPI(swaggerFormatPath, API).then(res).catch(rej);
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