
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const cwd = process.cwd();
const program = require('commander');
const confirm = require('../../utils/confirm');
const { readYAML } = require('./read');
const { yamlToSQL } = require('../../utils/formatToSQL');

module.exports = function (yamlFile, pageName) {
  const { outPath: dirPath, direct } = program;

  const yamlFilePath = path.resolve(cwd, yamlFile);
  const outSQLPath = path.resolve(cwd, dirPath);
  const spinner = ora(`读取 yaml 文件: ${yamlFilePath}`).start();
  const fileName = path.basename(yamlFilePath, path.extname(yamlFilePath));

  readYAML(yamlFilePath).then(data => {
    const { pages } = data;
    const genPageList = [];

    if (pageName) {
      spinner.info(`生成 ${pageName} 的 SQL 文件`);
      genPageList.push(pageName);
    } else {
      spinner.info(`将 yaml 里面的全部数据都生成为 SQL 文件`);
      genPageList.push(...Object.keys(pages));
    }

    let func = Promise.resolve();
    const sqlFilePath = path.join(outSQLPath, `${fileName}.sql`);
    const sqlContent = [];

    genPageList.forEach(pageName => {
      if (pages[pageName]) {
        func = func.then(_ => {
          const sql = yamlToSQL(pages[pageName]);
          sqlContent.push(sql);
        });
      } else {
        spinner.warn(`yaml 文件里不存在页面: ${pageName}`);
      }
    })

    return func
      .then(_ => {
        confirm(
          fs.existsSync(sqlFilePath),
          function () {
            fs.writeFile(sqlFilePath, sqlContent)
              .then(_ => {
                spinner.succeed(`生成 SQL 文件: ${sqlFilePath}`);
              }
              )
              .finally(_ => {
                process.exit();
              })
          },
          {
            message: `文件 ${sqlFilePath} 已存在, 是否覆盖`,
            direct: direct,
          }
        );
      })

  })
}