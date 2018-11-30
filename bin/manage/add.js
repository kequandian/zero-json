
const ora = require('ora');
const fsExtra = require('fs-extra');
const cwd = process.cwd();
const path = require('path');
const routerUtils = require('../../utils/router');
const templateReplace = require('../../utils/templateReplace');
const confirm = require('../../utils/confirm');

module.exports = function (pageName, dirPath) {
  const spinner = ora(`新增后台管理页面： ${pageName}`).start();
  dirPath = path.resolve(cwd, dirPath);

  const headerUpperCase = pageName.replace(/^\S/, s => s.toUpperCase());
  const modelFilePath = path.normalize(`${dirPath}/src/pages/${headerUpperCase}/models/${headerUpperCase}.js`);
  const routerFilePath = path.normalize(`${dirPath}/config/router.config.js`);
  const router = routerUtils(routerFilePath);

  spinner.info(`添加 model 文件: ${modelFilePath}`);

  // 页面名的首字母大写

  fsExtra.copy(
    `${__dirname}/template/model.js`,
    modelFilePath,
  )
    .then(() => {
      templateReplace(modelFilePath, 'ZERO_pageName', pageName);
      spinner.succeed(`model 文件已添加`);
    });

  spinner.info(`添加路由信息`);
  router.add({
    name: pageName,
    icon: `copy`,
    path: `/${pageName}`,
    routes: [],
  })
    .then(() => {
      spinner.succeed(`路由信息已添加`);
    });
}