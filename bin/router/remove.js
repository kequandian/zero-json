
const ora = require('ora');
const path = require('path');
const cwd = process.cwd();
const confirm = require('../../utils/confirm');
const program = require('commander');

const { findRoute, genRouterFile } = require('./utils/index');

module.exports = function (routePath) {
  const { inputPath, direct } = program;

  const spinner = ora(`移除路由 ${routePath}`).start();

  if (!inputPath) {
    spinner.fail('请通过 -i 来指定路由配置文件');
    process.exit();
  }
  const routerPath = path.resolve(cwd, inputPath);
  spinner.info(`读取路由文件 ${routerPath}`);

  delete require.cache[routerPath];
  const routerData = require(routerPath);
  const pathList = routePath.split('/');
  const parent = findRoute([pathList[0]], routerData);

  if (parent && pathList.length > 1) {
    const child = findRoute(pathList, routerData);
    if (child) {
      confirmWrapped(direct, routePath, routerPath, function () {
        parent.items = parent.items.filter(
          route => route.path !== `/${routePath}`
        );
        return routerData;
      })

    } else {
      spinner.fail('未能找到指定的路由');
      process.exit();
    }
  } else {

    confirmWrapped(direct, routePath, routerPath, function () {
      const data = routerData.filter(
        route => route.path !== `/${routePath}`
      );
      return data;
    })
  }

}

function confirmWrapped(direct, routePath, routerPath, func) {
  confirm(
    true,
    function () {
      const data = func();
      genRouterFile(routerPath, data)
        .finally(_ => {
          process.exit();
        })
    },
    {
      message: `确认要删除路由: ${routePath} ?`,
      direct: direct,
    }
  );
}