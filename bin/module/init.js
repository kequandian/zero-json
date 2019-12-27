
const ora = require('ora');
const clone = require('../cloneCML');
const fs = require('fs-extra');
const cwd = process.cwd();
const path = require('path');
const shell = require('shelljs');
const confirm = require('../../utils/confirm');

module.exports = function (moduleName, dirPath, direct) {
  if (!moduleName) {
    console.log(`无效的模块名：${moduleName}`);
    return false;
  }
  return new Promise((res, rej) => {
    const spinner = ora(`初始化后台管理模块： ${moduleName}`).start();
    dirPath = path.resolve(cwd, `${dirPath}/${moduleName}`);
    confirm(
      fs.existsSync(dirPath),
      function () {
        clone(moduleName, 'github@zele.pro:/home/github/isp/hub/llh/zero-code-template')
          .then((path) => {
            if (path) {
              shell.exec(`rm -rf ./${moduleName}/.git`, function () {
                spinner.succeed(`后台模块 ${moduleName} 初始化成功`);
                res();
                process.exit();
                // shell.exec(
                //   `mv ./${moduleName}/.gitignore ./${moduleName}/.gitignore.bak && mv ./${moduleName}/.gitignore.child ./${moduleName}/.gitignore`,
                //   function () {
                //     spinner.succeed(`后台模块 ${moduleName} 初始化成功`);
                //     res();
                //     process.exit();
                //   })
              });
            }
          }).catch((err) => rej(err));
      },
      {
        message: '目录已存在，是否覆盖？',
        direct: direct,
      }
    );
  });
}