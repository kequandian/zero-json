const fs = require('fs-extra');
const path = require('path');
const cwd = process.cwd();
const ora = require('ora');

module.exports = function (name,filePath = name) {
  const currentRegex = new RegExp(/^.{1,1}\//); // 检测是否以 ./ 开头
  const directRegex = new RegExp(/^\w+/); // 检测是否直接输入了文件名

  if (currentRegex.test(filePath) || directRegex.test(filePath)) {
    filePath = `${cwd}/${filePath}`.replace(/\//g, path.sep);
  }
  if (path.extname(filePath) === '') {
    filePath += '.js'
  }

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