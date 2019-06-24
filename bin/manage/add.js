
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
      const fileName = pageName.replace(/^\S/, (s) => s.toUpperCase());

      const pagesPath = path.join(dirPath, '/pages');
      const srcPath = path.join(dirPath, '/src', 'pages', fileName);
      fs.ensureDir(pagesPath);
      fs.ensureDir(path.join(srcPath, 'config'));

      confirm(
        fs.existsSync(path.join(pagesPath, `${pageName}.js`)),
        function () {
          const rst = Promise.all([
            generatePage(path.join(pagesPath, `${pageName}.js`), fileName),
            generateIndex(path.join(srcPath, 'index.js'), pageName),
            generateConfig(path.join(srcPath, 'config', `${pageName}.js`)),
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