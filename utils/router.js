
const fs = require('fs-extra');

/**
 * 
 * @param {string} routerFilePath 路由文件的绝对路径
 */
const router = function (routerFilePath) {
  if (!fs.existsSync(routerFilePath)) {
    console.log('未能找到路由文件:', routerFilePath);
    throw new Error('未能找到路由文件');
  }
  delete require.cache[routerFilePath];
  const routerEntity = require(routerFilePath);
  return {
    // 添加新的 一级菜单
    add: function (pathObject) {
      routerEntity.push(pathObject);

      return fs.outputFile(
        routerFilePath,
        'module.exports = ' + JSON.stringify(routerEntity, null, 2)
      );
    },
    // 添加新的 二级菜单
    append: function (pageName, pathObject) {
      let find = false;
      routerEntity.some(route => {
        // 找到菜单的路由项
        if (route.path === pageName) {
          find = true;
          if (!route.items) {
            route.items = [];
          }
          route.items.push(pathObject);
          return true;
        }
        return false;
      });

      if (find === false) {
        routerEntity.push({
          path: pageName,
          name: pageName.toUpperCase().replace('/', ''),
          icon: 'tag',
          items: [
            pathObject,
          ]
        });
      }

      return fs.outputFile(
        routerFilePath,
        'module.exports = ' + JSON.stringify(routerEntity, null, 2)
      );
    },
  }
}
module.exports = router;