
const fs = require('fs-extra');
const path = require('path');
const confirm = require('../../utils/confirm');
const program = require('commander');

const {
  generateIndex,
  generateTableConfig,
  generateAddFormConfig,
  generateEditFormConfig,
  generateSettingFile,
} = require('../../utils/generateFile');

const {
  genCRUDAPI,
} = require('../../utils/formatToBuildJSON');


module.exports = function (pageName, spinner, jsonData) {
  const { outPath: dirPath, direct } = program;
  const pagesPath = path.join(dirPath, pageName);

  return new Promise((res, rej) => {
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

    spinner.info(`正在生成 CRUD 页面: ${pageName}`);

    outFileList.forEach(f => {
      f && spinner.info(`预期生成文件：${f}`);
    })

    confirm(
      fs.existsSync(pagesPath),
      function () {
        fs.ensureDir(`${pagesPath}/config`)
          .then(_ => {
            const {
              crudAPI, map = {},
              searchFields = [], tableFields, formFields,
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
                  columns: 2,
                  ...genCRUDAPI(crudAPI),
                  layout: {
                    table: 'TitleContent',
                    form: 'TitleContent',
                  },
                  searchFields: searchFields,
                  tableFields: tableFields,
                  formFields: formFields,
                  ...restJsonData,
                }
              }),
            ]);
          })
          .then(_ => {
            spinner.succeed('文件已生成\n');
            res();
          })
          .catch(e => {
            spinner.fail(e.message);
            rej();
          })
      },
      {
        message: '确定要覆盖以上文件及目录？',
        direct: direct,
      }
    );
  })

}