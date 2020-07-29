
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const confirm = require('../../utils/confirm');

const {
  generateIndex,
  generateTableConfig,
  generateAddFormConfig,
  generateEditFormConfig,
  generateSettingFile,
} = require('../../utils/generateFile');

module.exports = function (pageName, jsonPath, dirPath, direct) {
  let spinner;
  let jsonData = {};
  let canReadJson;

  if (jsonPath) {
    spinner = ora(`读取 json ${jsonPath} 生成 CRUD 后台管理页面 ${pageName}`).start();
    canReadJson = _ => fs.readJson(jsonPath)
      .then(value => jsonData = value)
  } else {
    spinner = ora(`未通过参数 -i 输入 json 文件, 直接生成 CRUD 后台管理页面 ${pageName}`).start();
    canReadJson = _ => Promise.resolve()
  }

  const pagesPath = path.join(dirPath, pageName);

  const outFileList = [
    path.join(pagesPath, `${pageName}.js`),
    path.join(pagesPath, `${pageName}-add.js`),
    path.join(pagesPath, `${pageName}-edit.js`),
    // path.join(pagesPath, `${pageName}-view.js`),
    undefined,
    path.join(pagesPath, `config/index.js`),
    path.join(pagesPath, `config/${pageName}-add.js`),
    path.join(pagesPath, `config/${pageName}-edit.js`),
    path.join(pagesPath, `config/${pageName}-setting.json`),
  ];

  outFileList.forEach(f => {
    f && spinner.info(`生成文件：${f}`);
  })

  confirm(
    fs.existsSync(pagesPath),
    function () {
      canReadJson()
        .then(_ => fs.ensureDir(`${pagesPath}/config`))
        .then(_ => {
          return Promise.all([
            generateIndex({
              filePath: outFileList[0],
              namespace: pageName,
              type: 'index',
            }),
            generateIndex({
              filePath: outFileList[1],
              namespace: `${pageName}_add`,
              type: `${pageName}-add`,
            }),
            generateIndex({
              filePath: outFileList[2],
              namespace: `${pageName}_edit`,
              type: `${pageName}-edit`,
            }),

            generateTableConfig({
              filePath: outFileList[4],
              name: pageName,
            }),
            generateAddFormConfig({
              filePath: outFileList[5],
              name: pageName,
            }),
            generateEditFormConfig({
              filePath: outFileList[6],
              name: pageName,
            }),


            generateSettingFile({
              filePath: outFileList[7],
              data: {
                pageName,
                listAPI: '',
                createAPI: '',
                getAPI: '',
                updateAPI: '',
                deleteAPI: '',
                tableFields: [],
                formFields: [],
                ...jsonData,
              }
            }),
          ]);
        })
        .then(_ => {
          spinner.succeed(`成功`);
          process.exit();
        })
    },
    {
      message: '确定要覆盖以上文件及目录？',
      direct: direct,
    }
  );
}