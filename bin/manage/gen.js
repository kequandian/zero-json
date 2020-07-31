
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const confirm = require('../../utils/confirm');
const read = require('../../utils/swagger/read');

const {
  generateIndex,
  generateTableConfig,
  generateAddFormConfig,
  generateEditFormConfig,
  generateSettingFile,
} = require('../../utils/generateFile');

module.exports = function (pageName, jsonPath, dirPath, API, direct) {
  let jsonData = {};
  let canReadJson;

  const spinner = ora(`生成 CRUD 后台管理页面 ${pageName}`).start();
  if (API) {
    canReadJson = _ => read(API)
      .then(data => {
        jsonData = {
          listAPI: `${API}`,
          createAPI: `${API}`,
          getAPI: `${API}/[id]`,
          updateAPI: `${API}/[id]`,
          deleteAPI: `${API}/(id)`,
          tableFields: data.get.fields,
          formFields: data.post.fields,
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
    // path.join(pagesPath, `${pageName}-view.js`),
    undefined,
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
                searchFields: [
                  { field: 'search', label: '搜索', type: 'input' },
                ],
                tableFields: [
                  { field: 'id', label: 'ID' },
                  { field: 'name', label: '名称' },
                ],
                formFields: [
                  { field: 'name', label: '名称', type: 'input' },
                ],
                ...jsonData,
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