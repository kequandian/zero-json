
const ora = require('ora');
const fsExtra = require('fs-extra');
const cwd = process.cwd();
const path = require('path');
const routerUtils = require('../../utils/router');

module.exports = function (pageName, dirPath, API) {
  return new Promise((res, rej) => {
    dirPath = path.resolve(cwd, dirPath);

    const formatPageName = pageName.replace(/\/\w+$/, ''); // 确保是父级名称
    const routerFilePath = path.normalize(`${dirPath}/config/router.config.js`);

    const spinner = ora(`移除后台管理页面： ${pageName}`).start();
    const router = routerUtils(routerFilePath);

    if (router.check(formatPageName)) {
      spinner.info(`移除子路由信息`);
      delRouter(router, {
        spinner,
        formatPageName,
        pageName,
        dirPath,
        API,
      })
        .then(() => res());
    } else {
      spinner.info(`父级路由 ${formatPageName} 不存在`);
    }
  });
}

function delRouter(router, options) {
  const { spinner, formatPageName, pageName } = options;
  return router.remove(formatPageName, pageName).then(() => {
    spinner.succeed(`子路由信息已移除`);
    return new Promise(res => res(options));
  });
}