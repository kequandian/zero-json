
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const confirm = require('../../utils/confirm');

module.exports = function (pathAndPageName, dirPath, direct) {
  const spinner = ora(`移除后台管理页面： ${pathAndPageName}`).start();
  const [parents, pageName] = pathAndPageName.split('/');
  const parentUpper = parents.replace(/^\S/, (s) => s.toUpperCase());
  const fileName = pageName.replace(/^\S/, (s) => s.toUpperCase());

  const pagesPath = path.join(dirPath, '/src/pages', parents);
  const srcPath = path.join(dirPath, '/src/pages', parents, 'config', fileName);

  const removeFileList = [
    path.join(pagesPath, `${pageName}.js`),
    path.join(pagesPath, `${pageName}-add.js`),
    path.join(pagesPath, `${pageName}-edit.js`),
  ]

  removeFileList.forEach(f => {
    spinner.info(`删除文件：${f}`);
  })
  spinner.info(`删除目录：${srcPath}`);

  confirm(
    fs.existsSync(pagesPath) || fs.existsSync(srcPath),
    function () {
      const rst = Promise.all([
        fs.remove(removeFileList[0]),
        fs.remove(removeFileList[1]),
        fs.remove(removeFileList[2]),
        fs.remove(srcPath),
      ]);
      rst.then(_ => {
        spinner.succeed(`成功`);
        process.exit();
      })
    },
    {
      message: '确定要删除以上文件及目录？',
      direct: direct,
    }
  );
}