
const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const format = require('./format');
const shell = require('shelljs');

module.exports = function ls(filter, pwdPath) {
  // const swaggerPath = `${__dirname}/../../swagger/format.json`;
  const swaggerPath = path.normalize(`${pwdPath}/swagger/format.json`);
  if (!fs.existsSync(swaggerPath)) {
    format(pwdPath).then(() => {
      list(swaggerPath, filter);
    })
  } else {
    list(swaggerPath, filter);
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