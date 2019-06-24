
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

module.exports = function (pathAndPageName, dirPath, API, direct, spinner) {
  const [parents, pageName] = pathAndPageName.split('/');
  const parentsUpper = parents.replace(/^\S/, (s) => s.toUpperCase());
  const fileName = pageName.replace(/^\S/, (s) => s.toUpperCase());

  const pagesPath = path.join(dirPath, '/pages', parents);
  const srcPath = path.join(dirPath, '/src', 'pages', parentsUpper);
  fs.ensureDir(pagesPath);
  fs.ensureDir(path.join(srcPath, 'config'));

  confirm(
    fs.existsSync(path.join(pagesPath, `${pageName}.js`)),
    function () {
      const rst = Promise.all([
        generatePage(path.join(pagesPath, `${pageName}.js`), fileName, `${parentsUpper}/`),
        generateIndex(path.join(srcPath, `${fileName}.js`), pageName, parents),
        generateConfig(path.join(srcPath, 'config', `${pageName}.js`)),
      ]);
      rst.then(_ => {
        spinner.succeed(`子页面 ${pathAndPageName} 创建成功`);
        process.exit();
      })
    },
    {
      message: `页面 ${pathAndPageName} 已存在，是否覆盖？`,
      direct: direct,
    }
  );
  return;

}