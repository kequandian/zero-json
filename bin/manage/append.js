
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const confirm = require('../../utils/confirm');
const {
  generatePage,
  generateIndex,
  generateConfig,
  generateAPIFile,
} = require('../../utils/generateFile');
const router = require('../../utils/router');

module.exports = function (pathAndPageName, dirPath, API, direct, spinner) {
  const isUmi = fs.existsSync(path.join(dirPath, '.umirc.js'));
  const [parents, pageName] = pathAndPageName.split('/');
  const parentUpper = parents.replace(/^\S/, (s) => s.toUpperCase());
  const fileName = pageName.replace(/^\S/, (s) => s.toUpperCase());
  const routerPath = path.join(dirPath, 'src/config/router.config.js');
  const routerUtils = router(routerPath);

  let pagesPath = '';
  let srcPath = '';

  const output = [];

  if (isUmi) {
    pagesPath = path.join(dirPath, 'src/pages', parents);
    srcPath = path.join(dirPath, 'src/pages', parents);

  } else {
    pagesPath = path.join(dirPath, '/pages', parents);
    srcPath = path.join(dirPath, '/src/pages', parentUpper);

  }
  output.push(path.join(pagesPath, `${pageName}.js`));
  output.push(path.join(srcPath, `config/${fileName}/index.js`));
  output.push(path.join(srcPath, `config/${fileName}/config.js`));
  output.push(path.join(srcPath, `config/${fileName}/.API`, `${pageName}.api.js`));
  fs.ensureDirSync(pagesPath);
  fs.ensureDirSync(path.join(srcPath, 'config'));
  fs.ensureDirSync(path.join(srcPath, `config/${fileName}/.Form`));
  fs.ensureDirSync(path.join(srcPath, `config/${fileName}/.API`));

  confirm(
    fs.existsSync(output[0]),
    function () {
      const rst = Promise.all([
        generatePage({
          filePath: output[0],
          name: fileName,
          parents: `${parents}/`,
          // isUmi,
        }),
        generateIndex({
          filePath: output[1],
          name: fileName,
          namespace: parents,
        }),
        generateConfig({
          filePath: output[2],
          name: pathAndPageName,
          apiFileName: pageName,
        }),
        generateAPIFile({
          filePath: output[3],
        }),
        routerUtils.append(`/${parents}`, {
          path: `/${parents}/${pageName}`,
          name: pageName.toUpperCase(),
          icon: 'tag',
        }),
      ]);
      rst.then(_ => {
        spinner.succeed(`子页面 ${pathAndPageName} 创建成功`);
        process.exit();
      })
    },
    {
      message: `页面 ${pathAndPageName} 已存在，是否覆盖？`,
      direct: direct,
    }
  );
  return;

}