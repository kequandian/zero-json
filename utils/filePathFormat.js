
const cwd = process.cwd();
const path = require('path');

module.exports = function filePathFormat(filePath){
  const currentRegex = new RegExp(/^.{1,1}\//); // 检测是否以 ./ 开头
  const directRegex = new RegExp(/^\w+/); // 检测是否直接输入了文件名

  if (currentRegex.test(filePath) || directRegex.test(filePath)) {
    filePath = `${cwd}/${filePath}`.replace(/\//g, path.sep);
  }
  if (path.extname(filePath) === '') {
    filePath += '.js'
  }
  return filePath;
}