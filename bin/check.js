const { getAllFilePath } = require('../utils/fileUtils');
const path = require('path');
const ora = require('ora');
const { parseConfig } = require('../utils/parseFile');
const match = require('../utils/swagger/match');

module.exports = async function (dirPath) {
  const resolvePath = path.resolve(dirPath);
  const spinner = ora(`开始检查项目路径 ${resolvePath} 的配置文件`).start();
  const fileList = await getAllFilePath(resolvePath).filter(filePath => filePath.indexOf(`${path.sep}config${path.sep}`) > -1);
  const configList = fileList.filter(filePath => filePath.indexOf(`${path.sep}pages${path.sep}`) > -1);
  configList.forEach(file => {
    if (path.extname(file) === '.js') {
      console.log(file);
      const json = parseConfig(file);
      if (json) {
        const rst = [];
        const configList = getAllFieldsConfig(json);
        configList.forEach(item => {
          if (item.API) {
            rst.push(...match(item, `${resolvePath}/../`));
          }
        })
        if (rst.length === 0) {
          rst.push('测试全部通过');
        }
        rst.push('');
        console.log(rst.join('\n'));
      }
    }
  });
}

function getAllFieldsConfig(json) {
  const stack = json.items || [];
  const rst = json.fields ? [json.fields] : [];

  while (stack.length) {
    const item = stack.pop();

    Object.values(item).forEach(value => {
      if (typeof value === 'object') {
        Object.values(value).forEach(v => {
          if (Array.isArray(v)) {
            stack.push(...v);
          }
        });
      }

    });
    if (item.config) {
      if (item.config.fields) {
        rst.push(item.config); // 把 fields 连同 config 的其它项一起保存
        stack.push(...item.config.fields);
      }
      if (item.config.actions) {
        stack.push(...item.config.actions);
      }
    }
  }
  return rst;
}