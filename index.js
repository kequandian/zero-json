#!/usr/bin/env node

const program = require('commander');
// const { spawn } = require('child_process');
const shell = require('shelljs');

const cloneBin = require('./bin/clone');
const lsBin = require('./bin/ls');
const newBin = require('./bin/new');

const addBin = require('./bin/add');

if (!(shell.env.EXEPATH && shell.env.EXEPATH.indexOf('Git'))) {
  console.log('请在 Git Shell 的 CLI 环境下运行');
  return false;
}

program
  .version(require('./package').version)
  .description('修改 json 文件，完成模板编辑')
  .option('-f, --filePath [filePath]', '命令所操作的文件')
  .option('-i, --index [index]', '所操作项在配置文件中的位置')
  .option('-d, --direct [direct]', '直接修改，不提示',false)

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
  .command('cmpt <action> <cmptName>')
  .description('对组件进行 增删改 操作')
  .action(function (action, cmptName) {
    const actionMap = {
      'add': (cmptName, index, filePath, direct) => {
        addBin(cmptName, index, filePath, direct);
      },
      'update': (cmptName, index) => {
        console.log('修改组件', cmptName, index);
      },
      'delete': (cmptName, index) => {
        console.log('删除组件', index);
      },
      'undefined': () => {
        console.log('无效的 action。可选 add | update | delete');
      },
    };
    (actionMap[action] || actionMap[undefined])(cmptName, program.index, program.filePath, program.direct);
  })

program.parse(process.argv)

// const { spawn } = require('child_process');
// const child = spawn(`${__dirname}/shell/test.sh`,[],{
//   shell: true,
// });

// child.on('close', (code) => {
//   console.log(code);
// });