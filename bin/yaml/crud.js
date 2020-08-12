
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const cwd = process.cwd();
const program = require('commander');
const confirm = require('../../utils/confirm');
const { readYAMLToBuildJSON } = require('./read');
const genCRUDPage = require('../utils/genCRUDPage');

module.exports = function (yamlFile, pageName) {
  const { inputPath: jsonPath, outPath: dirPath, direct } = program;

  const yamlFilePath = path.resolve(cwd, yamlFile);
  const spinner = ora(`读取 yaml 文件: ${yamlFilePath}`).start();

  readYAMLToBuildJSON(yamlFile).then(data => {
    const genPageList = [];
    if (pageName) {
      spinner.info(`生成 ${pageName} 的 CRUD 页面`);
      genPageList.push(pageName);
    } else {
      spinner.info(`将 yaml 里面的全部页面都生成为 CRUD 页面`);
      genPageList.push(...Object.keys(data));
    }

    let func = Promise.resolve();
    genPageList.forEach(pageName => {
      if (data[pageName]) {
        func = func.then(_ => genCRUDPage(pageName, spinner, data[pageName]));
      } else {
        spinner.warn(`yaml 文件里不存在页面: ${pageName}`);
      }
    })

    return func
      .then(_ => {
        spinner.succeed(`文件已全部生成`);
      }
      )
      .finally(_ => {
        process.exit();
      })
  })
}