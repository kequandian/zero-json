const { getAllFilePath } = require('../utils/fileUtils');
const path = require('path');
const ora = require('ora');
const { parseConfig } = require('../utils/parseFile');

module.exports = async function (dirPath) {
  const resolvePath =  path.resolve(dirPath);
  const spinner = ora(`开始检查项目路径 ${resolvePath} 的配置文件`).start();
  const fileList = await getAllFilePath(resolvePath).filter(filePath => filePath.indexOf('config') > -1);
  const configList = fileList.filter(filePath => filePath.indexOf('pages') > -1);
  configList.forEach(file => {
    const rst = parseConfig(file);
    console.log(rst);
  });
}
