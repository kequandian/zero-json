const co = require('co');
const { confirm } = require('co-prompt');
const ora = require('ora');
const shell = require('shelljs');
const fs = require('fs-extra');
const filePathFormat = require('../utils/filePathFormat');

module.exports = function (cmptName, index, filePath, direct) {
  const spinner = ora('').start();
  if (filePath === undefined) {
    spinner.fail('必须输入需要操作的文件。可通过 -f 参数指定');
    return false;
  }
  filePath = filePathFormat(filePath);

  let configFile = {};
  try {
    configFile = require(filePath);
  } catch (error) {
    spinner.fail(`找不到配置文件 ${filePath}`);
    return false;
  }

  spinner.info('修改之前的文件内容：');
  shell.exec(`cat ${filePath} `);
  spinner.stopAndPersist({ symbol: '' });
  spinner.stopAndPersist({ symbol: '' });

  if(index === undefined){
    index = configFile.items.length + 1;
  }

  configFile.items.splice(index - 1, 0, {
    layout: 'Grid',
    span: 24,
    component: cmptName,
  });
  configFile = 'module.exports = ' + JSON.stringify(configFile, null, 2);
  spinner.info('修改之后的文件内容：');
  console.log(configFile);

  co(function* () {
    if (direct === false) {
      const ok = yield confirm('确定要修改吗？[y/n]');
      if (!ok) {
        process.exit();
        return false;
      }
    }
    fs.outputFile(filePath, configFile).then(() => {
      spinner.succeed(`配置文件 ${filePath} 的组件添加已完成`);
      process.exit();
    }).catch((err) => {
      spinner.fail(err);
      process.exit();
    })
  })
}