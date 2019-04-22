const program = require('commander');
const fs = require('fs-extra');
const path = require('path');
const fsExtra = require('fs-extra');
const format = require('./format');
const shell = require('shelljs');

module.exports = function ls(filter, pwdPath) {
  const swaggerFilePath = path.resolve(program.swagger);
  const swaggerFormatPath = `${path.dirname(swaggerFilePath)}/format.json`;
  if (!fs.existsSync(swaggerFormatPath)) {
    format(pwdPath).then(() => {
      list(swaggerFormatPath, filter);
    })
  } else {
    list(swaggerFormatPath, filter);
  }
}

function list(path, filter = '') {
  fsExtra.readJSON(path).then((jsonData) => {
    const lsData = [];
    Object.keys(jsonData).forEach(API => {
      const APIItem = jsonData[API];
      const methodList = ['get', 'post', 'put', 'delete'];
      methodList.forEach(method => {
        if (APIItem[method]) {
          lsData.push(`${method} ${API} ${APIItem[method].summary}`);
        }
      });
    });
    fsExtra.outputFile(`${path}/../ls`, lsData.join('\n'))
    .then( () => {
      shell.exec(`cat ${path}/../ls | grep '${filter}' `);
    } )
  });
}