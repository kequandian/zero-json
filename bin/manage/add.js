
const ora = require('ora');
const fsExtra = require('fs-extra');
const cwd = process.cwd();
const path = require('path');
const routerUtils = require('../../utils/router');
const templateReplace = require('../../utils/templateReplace');
const append = require('./append');
const confirm = require('../../utils/confirm');

module.exports = function (pageName, dirPath, API) {
  dirPath = path.resolve(cwd, dirPath);

  const formatPageName = pageName.replace(/\/\w+$/, '');
  const headerUpperCase = formatPageName.replace(/^\S/, s => s.toUpperCase());
  const modelFilePath = path.normalize(`${dirPath}/src/pages/${headerUpperCase}/models/${headerUpperCase}.js`);
  const routerFilePath = path.normalize(`${dirPath}/config/router.config.js`);

  const spinner = ora(`新增后台管理页面： ${pageName}`).start();
  const router = routerUtils(routerFilePath);

  if (!router.check(formatPageName)) {
    spinner.info(`添加路由信息`);
    router.add({
      name: formatPageName,
      icon: `copy`,
      path: `/${formatPageName}`,
      routes: [],
    })
      .then(() => {
        spinner.succeed(`路由信息已添加`);
        if (pageName.indexOf('/') > -1) {
          append(pageName, dirPath, API);
          return false;
        }
        spinner.info(`添加 model 文件: ${modelFilePath}`);

        // 页面名的首字母大写

        fsExtra.copy(
          `${__dirname}/template/model.js`,
          modelFilePath,
        )
          .then(() => {
            templateReplace(modelFilePath, 'ZERO_pageName', formatPageName);
            spinner.succeed(`model 文件已添加`);
          });
      });
  } else {
    spinner.info(`父级路由已存在`);
  }
}