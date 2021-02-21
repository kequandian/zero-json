
const ora = require('ora');
// const clone = require('../clone');
const clone = require('../cloneCML');
const fs = require('fs-extra');
const cwd = process.cwd();
const path = require('path');
const shell = require('shelljs');
const confirm = require('../../utils/confirm');
const program = require('commander');

module.exports = function (projectName) {
  let { outPath: dirPath, direct } = program;

  if (!projectName) {
    console.log(`无效的项目名：${projectName}`);
    return false;
  }
  return new Promise((res, rej) => {
    const spinner = ora(`初始化后台管理项目： ${projectName}`).start();
    dirPath = path.resolve(cwd, `${dirPath}/${projectName}`);

    confirm(
      fs.existsSync(dirPath),
      function () {
        fs.remove(dirPath)
          .then(_ => {
            //clone(projectName, 'github@zele.pro:/home/github/isp/hub/llh/zero-code-template')
            clone(projectName, 'https://github.com/kequandian/zero-element-admin')
              .then((path) => {
                if (path) {
                  shell.exec(`rm -rf ./${projectName}/.git`, function () {
                    spinner.succeed(`后台项目 ${projectName} 初始化成功`);
                    res();
                    process.exit();
                  });
                }
              }).catch((err) => rej(err));
          })
      },
      {
        message: '目录已存在，是否覆盖？',
        direct: direct,
      }
    );

    // confirm(
    //   fs.existsSync(dirPath),
    //   function () {
    //     clone('kequandian/template-antd-management', dirPath)
    //       .then((path) => {
    //         if (path) {

    //           spinner.succeed(`后台项目 ${projectName} 初始化成功`);
    //           res();
    //         }
    //         process.exit();
    //       }).catch((err) => rej(err));
    //   },
    //   {
    //     message: '目录已存在，是否覆盖？',
    //     direct: direct,
    //   }
    // );
  });
}
