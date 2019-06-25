
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const appendForm = require('./appendForm');
const confirm = require('../../utils/confirm');
const {
  generateFormPage,
  generateFormIndex,
} = require('../../utils/generateFile');

module.exports = function (pageName, dirPath, direct) {
  const spinner = ora(`新增后台管理页面对应的表单页： ${pageName}`).start();
  if (/^\w/.test(pageName)) {
    if (/^\w+\/\w+$/.test(pageName)) {
      appendForm(pageName, dirPath, direct, spinner);
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
      output.push(path.join(pagesPath, `${pageName}-add.js`));
      output.push(path.join(pagesPath, `${pageName}-edit.js`));
      output.push(path.join(srcPath, `${pageName}Add.js`));
      output.push(path.join(srcPath, `${pageName}Edit.js`));
      fs.ensureDirSync(pagesPath);
      fs.ensureDirSync(path.join(srcPath, 'config'));

      confirm(
        fs.existsSync(output[0]),
        function () {
          const rst = Promise.all([
            generateFormPage({
              filePath: output[0],
              name: fileName,
              filename: `${pageName}Add`,
              isUmi,
            }),
            generateFormPage({
              filePath: output[1],
              name: fileName,
              filename: `${pageName}Edit`,
              isUmi,
            }),
            generateFormIndex({
              filePath: output[2],
              name: pageName,
            }),
            generateFormIndex({
              filePath: output[3],
              name: pageName,
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