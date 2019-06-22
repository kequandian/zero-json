
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const confirm = require('../../utils/confirm');

module.exports = function (pageName, dirPath, direct) {
  const spinner = ora(`移除后台管理页面： ${pageName}`).start();
  const fileName = pageName.replace(/^\S/, (s) => s.toUpperCase());
  
  const pagesPath = path.join(dirPath, '/pages', `${pageName}.js`);
  const srcPath = path.join(dirPath, '/src', 'pages', fileName);

  spinner.info(`删除文件：${pagesPath}`);
  spinner.info(`删除目录：${srcPath}`);

  confirm(
    fs.existsSync(pagesPath) || fs.existsSync(srcPath),
    function () {
      const rst = Promise.all([
        fs.remove(pagesPath),
        fs.remove(srcPath),
      ]);
      rst.then(_=> {
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