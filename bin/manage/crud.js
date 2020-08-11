
const ora = require('ora');
const program = require('commander');
const path = require('path');
const fs = require('fs-extra');

const read = require('../../utils/swagger/read');
const genCRUDPage = require('../utils/genCRUDPage');
const {
  filterFields,
  genCRUDAPI,
} = require('../../utils/formatToBuildJSON');

module.exports = function (pageName, API) {
  const { inputPath: jsonPath } = program;

  const spinner = ora(`生成 CRUD 后台管理页面 ${pageName}`).start();

  let jsonData = {};
  let canReadJson;

  if (API) {
    canReadJson = _ => read(API)
      .then(data => {
        jsonData = {
          ...genCRUDAPI(API),
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

  canReadJson()
    .then(_ => {
      return genCRUDPage(pageName, spinner, jsonData)
        .then(_ => {
          // spinner.succeed(`文件已生成`);
        })
    })
    .finally(_ => {
      process.exit();
    })
}