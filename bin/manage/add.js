
const ora = require('ora');
const fsExtra = require('fs-extra');
const cwd = process.cwd();
const path = require('path');
const routerUtils = require('../../utils/router');
const templateReplace = require('../../utils/templateReplace');
const append = require('./append');
const confirm = require('../../utils/confirm');

module.exports = function (pageName, dirPath, API) {
  return new Promise((res, rej) => {
    dirPath = path.resolve(cwd, dirPath);

    const formatPageName = pageName.replace(/\/\w+$/, ''); // 确保是父级名称
    const routerFilePath = path.normalize(`${dirPath}/config/router.config.js`);

    const spinner = ora(`新增后台管理页面： ${pageName}`).start();
    const router = routerUtils(routerFilePath);

    if (!router.check(formatPageName)) {
      spinner.info(`添加路由信息`);
      addRouter(router, {
        spinner,
        formatPageName,
        pageName,
        dirPath,
        API,
      })
        .then(appendPage)
        .then(() => res());
    } else {
      spinner.info(`父级路由已存在`);
      appendPage({
        formatPageName,
        pageName,
        dirPath,
        API,
      })
        .then(() => res());
    }
  });
}

function addRouter(router, options) {
  const { spinner, formatPageName } = options;
  return router.add({
    name: formatPageName,
    icon: `copy`,
    path: `/${formatPageName}`,
    routes: [],
  }).then(() => {
    spinner.succeed(`路由信息已添加`);
    return new Promise(res => res(options));
  });
}

function appendPage({ pageName, dirPath, API }) {
  if (pageName.indexOf('/') > -1) {
    return append(pageName, dirPath, API);
  }
  return new Promise(res => res());
}