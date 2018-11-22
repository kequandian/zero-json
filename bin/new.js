const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');

const filePathFormat = require('../utils/filePathFormat');

module.exports = function (name,filePath = name) {
  filePath = filePathFormat(filePath);

  const spinner = ora(`新增配置文件 ${filePath}`).start();
  const extname = path.extname(filePath);
  if (extname === '.js') {

    createFile(filePath).then(() => {
      spinner.succeed(`配置文件 ${filePath} 已生成`);
    }).catch((err) => {
      spinner.fail(err);
    });
  } else {
    spinner.fail(`非法的文件扩展名。预期 .js 传入的却是 ${extname}`);
  }
}

function createFile(path) {
  const template = {
    layout: 'Grid',
    title: '新增配置文件',
    items: [],
  };
  const date = 'module.exports = ' + JSON.stringify(template, null, 2);
  return fs.outputFile(path, date);
}