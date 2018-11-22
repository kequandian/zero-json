#!/usr/bin/env node

const program = require('commander');
// const { spawn } = require('child_process');
const shell = require('shelljs');

const cloneBin = require('./bin/clone');
const lsBin = require('./bin/ls');
const newBin = require('./bin/new');

if (!(shell.env.EXEPATH && shell.env.EXEPATH.indexOf('Git'))) {
  console.log('请在 Git Shell 的 CLI 环境下运行');
  return false;
}

program
  .version(require('./package').version)
  .description('修改 json 文件，完成模板编辑')
  .option('-f, --filePath [filePath]', '命令所操作的文件')

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

program.parse(process.argv)

// const { spawn } = require('child_process');
// const child = spawn(`${__dirname}/shell/test.sh`,[],{
//   shell: true,
// });

// child.on('close', (code) => {
//   console.log(code);
// });