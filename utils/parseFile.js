const fs = require('fs-extra');
const localeval = require('localeval');
const path = require('path');

/**
 * 在 CommonJS 里面解析 es6 的 import
 *
 * @param {string} filePath
 * @return {object} 解析后的 JSON 对象
 */
function parseConfig(filePath) {
  let fileContent = fs.readFileSync(filePath).toString();
  const importSet = {};
  const rst = {};

  if (fileContent.indexOf('module.exports') === -1) {

    // 处理标准的 import
    // 预期： import test from './test.config.js';
    const importList = fileContent.match(/import [\S]+ from \S+/gm);
    if (importList && importList.length) {
      importList.forEach(importItem => {
        const importName = /import (\S+)/.exec(importItem)[1];
        importSet[importName] = handleImport(filePath, importItem);
      });
    }

    fileContent = fileContent.replace(/import [\S]+ from \S+/gm, '').replace(/export default/g, 'const defaultExport =');
    localeval(`${fileContent}; rst.export = defaultExport;`, { ...importSet, rst });

    return rst.export;

  } else {
    return require(filePath);
  }
}


/**
 * 把 import 的相对路径替换为绝对路径
 *
 * @param {string} filePath
 * @param {string} importItem
 * @returns {Function} parseConfig()
 */
function handleImport(filePath, importItem) {
  const parent = path.dirname(filePath); // import 的父目录
  let temp = importItem.match(/[\',\"]\S+[\',\"]/g)[0].replace(/\'/g, '').replace(/\"/g, ''); // import 的目标
  if (path.extname(temp) === '') {
    temp += '.js';
  }

  return parseConfig(`${parent}${path.sep}${temp}`);
}

module.exports = {
  parseConfig,
};