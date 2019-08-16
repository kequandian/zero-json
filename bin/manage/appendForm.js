
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const append = require('./append');
const confirm = require('../../utils/confirm');
const {
  generateFormPage,
  generateFormIndex,
  generateForm,
  generateFormJSON,
} = require('../../utils/generateFile');

module.exports = function (pathAndPageName, dirPath, direct, spinner) {
  const isUmi = fs.existsSync(path.join(dirPath, '.umirc.js'));
  const [parents, pageName] = pathAndPageName.split('/');
  const parentUpper = parents.replace(/^\S/, (s) => s.toUpperCase());
  const fileName = pageName.replace(/^\S/, (s) => s.toUpperCase());

  let pagesPath = '';
  let srcPath = '';

  const output = [];

  if (isUmi) {
    pagesPath = path.join(dirPath, '/src', '/pages', parents);
    srcPath = path.join(dirPath, '/src', 'config', parentUpper, '.Form');

  } else {
    pagesPath = path.join(dirPath, '/pages', parents);
    srcPath = path.join(dirPath, '/src', 'pages', parentUpper, '.Form');

  }
  output.push(path.join(pagesPath, `${pageName}-add.js`));
  output.push(path.join(pagesPath, `${pageName}-edit.js`));
  output.push(path.join(srcPath, `${fileName}Add.js`));
  output.push(path.join(srcPath, `${fileName}Edit.js`));
  output.push(path.join(srcPath, `${fileName}-add.form.js`));
  output.push(path.join(srcPath, `${fileName}-edit.form.js`));
  output.push(path.join(srcPath, `${fileName}-add.form.json`));
  output.push(path.join(srcPath, `${fileName}-edit.form.json`));
  fs.ensureDirSync(pagesPath);
  fs.ensureDirSync(path.join(srcPath));

  confirm(
    fs.existsSync(output[0]),
    function () {
      const rst = Promise.all([
        generateFormPage({
          filePath: output[0],
          name: fileName,
          parentUpper: `${parentUpper}/`,
          filename: `${fileName}Add`,
          isUmi,
        }),
        generateFormPage({
          filePath: output[1],
          name: fileName,
          parentUpper: `${parentUpper}/`,
          filename: `${fileName}Edit`,
          isUmi,
        }),
        generateFormIndex({
          filePath: output[2],
          name: pageName,
          parentName: `./${fileName}-add.`,
        }),
        generateFormIndex({
          filePath: output[3],
          name: pageName,
          parentName: `./${fileName}-edit.`,
        }),
        generateForm({
          filePath: output[4],
          name: fileName,
        }),
        generateForm({
          filePath: output[5],
          name: fileName,
        }),
        generateFormJSON({
          filePath: output[6],
        }),
        generateFormJSON({
          filePath: output[7],
        }),
      ]);
      rst.then(_ => {
        spinner.succeed(`子页面表单页 ${pathAndPageName} 创建成功`);
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