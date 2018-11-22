const shell = require('shelljs');
const ora = require('ora');

module.exports = function () {
  const spinner = ora('').start();
  spinner.info('当前可用组件：');
  spinner.stopAndPersist({ symbol: '>>' });

  const path = `${__dirname}/../template/layout`;
  const templateOutPath = require(`${path}/package.json`).main;

  shell.exec(`cat ${path}/${templateOutPath} | grep '.default;' | grep -E -o '^(exports.)[a-zA-Z]+' | sed 's/exports.//' `);
}