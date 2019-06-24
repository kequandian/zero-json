
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const append = require('./append');
const confirm = require('../../utils/confirm');
const {
  generatePage,
  generateIndex,
  generateConfig
} = require('../../utils/generateFile');

module.exports = function (pageName, dirPath, API, direct) {
  const spinner = ora(`新增后台管理页面： ${pageName}`).start();
  if (/^\w/.test(pageName)) {
    if (/^\w+\/\w+$/.test(pageName)) {
      append(pageName, dirPath, API, direct, spinner);
    } else {
      const isUmi = fs.existsSync(path.join(dirPath, '.umirc.js'));
      const fileName = pageName.replace(/^\S/, (s) => s.toUpperCase());

      let pagesPath = '';
      let srcPath = '';

      const output = [];

      if (isUmi) {
        pagesPath = path.join(dirPath, '/src', '/pages');
        srcPath = path.join(dirPath, '/src', 'config', fileName);

      } else {
        pagesPath = path.join(dirPath, '/pages');
        srcPath = path.join(dirPath, '/src', 'pages', fileName);
      }
      output.push(path.join(pagesPath, `${pageName}.js`));
      output.push(path.join(srcPath, 'index.js'));
      output.push(path.join(srcPath, 'config', `${pageName}.js`));
      fs.ensureDir(pagesPath);
      fs.ensureDir(path.join(srcPath, 'config'));

      confirm(
        fs.existsSync(output[0]),
        function () {
          const rst = Promise.all([
            generatePage({
              filePath: output[0],
              name: fileName,
              isUmi,
            }),
            generateIndex({
              filePath: output[1],
              name: pageName,
            }),
            generateConfig({
              filePath: output[2],
            }),
          ]);
          rst.then(_ => {
            spinner.succeed(`成功`);
            process.exit();
          })
        },
        {
          message: `页面 ${pageName} 已存在，是否覆盖？`,
          direct: direct,
        }
      );
      return;
    }

  } else {
    spinner.warn(`无效的 pageName 格式, 正确示例: name 或 page/name`);
  }

}