#!/usr/bin/env node

const program = require('commander');
const shell = require('shelljs');

const cloneBin = require('./bin/clone');
const lsBin = require('./bin/ls');
const newBin = require('./bin/new');

const { comAdd, comUpdate, comDelete } = require('./bin/com');

const { ls: swaggerLs, format: swaggerFormat } = require('./bin/swagger');

if (!(shell.env.EXEPATH && shell.env.EXEPATH.indexOf('Git'))) {
  console.log('请在 Git Shell 的 CLI 环境下运行');
  return false;
}

program
  .version(require('./package').version)
  .description('修改 json 文件，完成模板编辑')
  .option('-f, --filePath [filePath]', '命令所操作的文件')
  .option('-i, --index [index]', '所操作项在配置文件中的位置')
  .option('-d, --direct [direct]', '直接进行操作，不提示确认', false)

program
  .command('clone')
  .description('下载 或 更新 模板')
  .action(function () {
    cloneBin();
  })
program
  .command('ls')
  .description('列出可用的组件')
  .action(function () {
    lsBin();
  })
program
  .command('new <fileName>')
  .description('新增配置文件')
  .action(function (fileName) {
    newBin(fileName, program.filePath);
  })
program
  .command('com <action> <comName>')
  .description('对组件进行 增删改 操作')
  .action(function (action, comName) {
    const actionMap = {
      'add': (comName, index, filePath, direct) => {
        comAdd(comName, index, filePath, direct);
      },
      'update': (comName, index, filePath, direct) => {
        comUpdate(comName, index, filePath, direct);
      },
      'delete': (comName, index, filePath, direct) => {
        comDelete(comName, index, filePath, direct);
      },
      'undefined': () => {
        console.log('无效的 action。可选 add | update | delete');
      },
    };
    (actionMap[action] || actionMap[undefined])(comName, program.index, program.filePath, program.direct);
  })
program
  .command('swagger <action> [arguments]')
  .description([
    'swagger 工具',
    '  -> swagger ls [filter] 列出 swagger 可用的 API',
    '  -> swagger format 重新 format swagger.json 文件',
  ].join('\n'))
  .action(function () {
    const [action, ...restArg] = arguments;
    const actionMap = {
      'ls': (filter) => {
        swaggerLs(filter);
      },
      'format': () => {
        swaggerFormat();
      },
      'undefined': () => {
        console.log('无效的 action。可选 ls | format');
      },
    };
    (actionMap[action] || actionMap[undefined])(...restArg);
  })

program.parse(process.argv)