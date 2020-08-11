
const ora = require('ora');
const path = require('path');
const cwd = process.cwd();
const confirm = require('../../utils/confirm');
const program = require('commander');

const { findRoute, genRouterFile } = require('./utils/index');

module.exports = function (routeName, routePath) {
  const { inputPath, direct } = program;

  const spinner = ora(`创建新路由 ${routeName} ${routePath}`).start();

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

  if (parent) {
    const child = findRoute(pathList, routerData);
    if (child) {
      confirm(
        true,
        function () {
          child.name = routeName;
          genRouterFile(routerPath, routerData)
            .finally(_ => {
              process.exit();
            })
        },
        {
          message: `路由 ${routePath} 已存在, 是否覆盖`,
          direct: direct,
        }
      );
    } else {
      if (!Array.isArray(parent.items)) {
        parent.items = [];
      }
      parent.items.push({
        name: routeName,
        path: `/${routePath}`,
      });
      genRouterFile(routerPath, routerData);
    }
  } else {
    if (pathList.length > 1) {
      routerData.push({
        name: routeName,
        path: `/${pathList[0]}`,
        items: [
          {
            name: routeName,
            path: `/${routePath}`,
          }
        ]
      });
    } else {
      routerData.push({
        name: routeName,
        path: `/${routePath}`,
      });
    }
    genRouterFile(routerPath, routerData);
  }

}