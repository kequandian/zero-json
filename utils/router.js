
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
      const [, index] = findRoute(pathName, routerEntity);
      if (!index) {
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
      }

      return fs.outputFile(
        routerFilePath,
        'module.exports = ' + JSON.stringify(routerEntity, null, 2)
      );
    },
  }
}
/**
 * 从路由实体中找到 pathName 的实体
 * @param {string} pathName 需要找的路由路径
 * @param {array} routerEntity 读取路由配置文件后返回的实体
 */
function findRoute(pathName, routerEntity) {
  const stack = [routerEntity];
  let parent = [];
  let index;

  while (stack.length) {
    const list = stack.shift();
    const rst = list.some((route, i) => {
      if (route.path === pathName) {
        parent = list;
        index = i;
        return true;
      }
      if (Array.isArray(route.items)) {
        stack.push(route.items);
      }
      return false;
    });

    if (rst) {
      break;
    }
  }

  return [parent, index];
}
module.exports = router;