
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const confirm = require('../../utils/confirm');
const read = require('../../utils/swagger/read');
const program = require('commander');
const baseSetting = require('../utils/baseSetting');

const {
  generateIndex,
  generateCategoryTableConfig,
  generateAddFormConfig,
  generateEditFormConfig,
  generateDetailConfig,
  generateSettingFile,
} = require('../../utils/generateFile');

const {
  filterFields,
  genCRUDAPI,
} = require('../../utils/formatToBuildJSON');

module.exports = function (pageName, scope, API) {
  let jsonData = {};
  let canReadJson;
  const { inputPath: jsonPath, outPath: dirPath, direct } = program;

  const spinner = ora(`生成 分类CRUD 后台管理页面 ${pageName}`).start();

  if (scope) {
    spinner.info(`添加分类功能 ${scope}`);
  } else {
    spinner.fail('必须输入 scope 参数');
    return false;
  }

  if (API) {
    canReadJson = _ => read(API)
      .then(data => {
        jsonData = {
          ...baseSetting,
          ...genCRUDAPI(API, '?categoryId=<id>'),
          tableFields: filterFields(data.get.fields),
          formFields: filterFields(data.post.fields),
        };
      })
  } else {
    canReadJson = _ => {
      if (jsonPath) {
        spinner.info(`读取 json ${jsonPath} 生成 CRUD 后台管理页面 ${pageName}`);
        return fs.readJson(jsonPath)
          .then(value => jsonData = value)
      } else {
        const defaultJSONFile = path.join(process.cwd(), 'build.json');
        spinner.info(`未通过参数 -i 输入 json 文件, 尝试读取 ${defaultJSONFile}`);
        return fs.readJson(defaultJSONFile)
          .then(value => jsonData = value)
          .catch(_ => {
            spinner.warn('读取 json 失败, 将会使用默认值来生成 CRUD 后台管理页面');
            return Promise.resolve();
          })
      }
    }
  }

  const pagesPath = path.join(dirPath, pageName);

  const outFileList = [
    path.join(pagesPath, `index.js`),
    path.join(pagesPath, `${pageName}-add.js`),
    path.join(pagesPath, `${pageName}-edit.js`),
    path.join(pagesPath, `${pageName}-view.js`),
    path.join(pagesPath, `config/index.js`),
    path.join(pagesPath, `config/${pageName}-add.js`),
    path.join(pagesPath, `config/${pageName}-edit.js`),
    path.join(pagesPath, `config/${pageName}-setting.json`),
  ];

  outFileList.forEach(f => {
    f && spinner.info(`预期生成文件：${f}`);
  })

  confirm(
    fs.existsSync(pagesPath),
    function () {
      canReadJson()
        .then(_ => fs.ensureDir(`${pagesPath}/config`))
        .then(_ => {
          const {
            crudAPI, map = {},
            searchFields, tableFields, formFields,
            viewOthers,
            ...restJsonData
          } = jsonData;

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
            generateDetailConfig({
              filePath: outFileList[3],
              namespace: pageName,
              name: pageName,
              viewOthers,
            }),

            generateCategoryTableConfig({
              filePath: outFileList[4],
              name: pageName,
              scope,
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
                ...restJsonData,
                listAPI: '',
                createAPI: '',
                getAPI: '',
                updateAPI: '',
                deleteAPI: '',
                ...genCRUDAPI(crudAPI, '?categoryId=<id>'),
                searchFields: searchFields,
                tableFields: tableFields,
                formFields: formFields,
                viewOthers,
              }
            }),
          ]);
        })
        .then(_ => {
          spinner.succeed(`文件已生成`);
          process.exit();
        })
        .catch(e => {
          spinner.fail(e.message);
          process.exit();
        })
    },
    {
      message: '确定要覆盖以上文件及目录？',
      direct: direct,
    }
  );
}