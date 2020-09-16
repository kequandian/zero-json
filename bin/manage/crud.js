
const ora = require('ora');
const program = require('commander');
const path = require('path');
const fs = require('fs-extra');

const read = require('../../utils/swagger/read');
const genCRUDPage = require('../utils/genCRUDPage');
const baseSetting = require('../utils/baseSetting');
const {
  filterFields,
  genCRUDAPI,
} = require('../../utils/formatToBuildJSON');

module.exports = function (inputPageName, API) {
  const { inputPath: jsonPath } = program;

  if (!jsonPath) {
    throw new Error('需要通过参数 -i 来指定输入的 json 文件');
  }

  const pageName = inputPageName || path.basename(jsonPath, '.json');

  const spinner = ora(`生成 CRUD 后台管理页面 ${pageName}`).start();

  let jsonData = {};
  let canReadJson;

  if (API) {
    canReadJson = _ => read(API)
      .then(data => {
        jsonData = {
          ...baseSetting,
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