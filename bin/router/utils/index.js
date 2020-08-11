const fs = require('fs-extra');

function genRouterFile(routerPath, data) {
  return fs.writeFile(routerPath, `module.exports = \n${JSON.stringify(data, null, 2)}`);
}

function findRoute(pathList, routerData) {
  const [curr, ...restC] = pathList;
  const currF = `/${curr}`;

  if (Array.isArray(routerData)) {
    const find = routerData.find(route => route.path === currF);
    if (find) {
      if (restC.length > 0 && find.items) {
        const [next, ...restN] = restC;

        return findRoute([`${curr}/${next}`, ...restN], find.items);
      }
      return find;
    }
  }

  return null;

}

module.exports = {
  findRoute,
  genRouterFile,
}