
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
  const isUmi = fs.existsSync(path.join(dirPath, '.umirc.js'));
  const [parents, pageName] = pathAndPageName.split('/');
  const parentsUpper = parents.replace(/^\S/, (s) => s.toUpperCase());
  const fileName = pageName.replace(/^\S/, (s) => s.toUpperCase());

  let pagesPath = '';
  let srcPath = '';

  const output = [];

  if (isUmi) {
    pagesPath = path.join(dirPath, '/src', '/pages', parents);
    srcPath = path.join(dirPath, '/src', 'config', parentsUpper);

  } else {
    pagesPath = path.join(dirPath, '/pages', parents);
    srcPath = path.join(dirPath, '/src', 'pages', parentsUpper);

  }
  output.push(path.join(pagesPath, `${pageName}.js`));
  output.push(path.join(srcPath, `${fileName}.js`));
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
          parentsUpper: `${parentsUpper}/`,
          isUmi,
        }),
        generateIndex({
          filePath: output[1],
          name: pageName,
          namespace: parents,
        }),
        generateConfig({
          filePath: output[2],
        }),
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