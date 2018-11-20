#!/usr/bin/env node

const program = require('commander');
// const { spawn } = require('child_process');
const shell = require('shelljs');
const ora = require('ora');
const clone = require('./bin/clone');

program
  .version(require('./package').version)
  .description('修改 json 文件，完成模板编辑')

program
  .command('clone')
  .description('下载 或 更新 模板')
  .action(function (name) {
    const spinner = ora('正在 clone 项目 kequandian/zero-layout').start();

    clone('kequandian/zero-layout', 'layout').then((msg) => {
      spinner.succeed(msg);
    }).catch((err) => {
      spinner.fail(err);
    });

  })
program
  .command('ls')
  .description('列出可用的组件')
  .action(function (name) {
    const spinner = ora('').start();
    spinner.info('当前可用组件：');
    spinner.stopAndPersist({symbol: '>>'});

    const path = `${__dirname}/template/layout`;
    const templateOutPath = require(`${path}/package.json`).main;

    shell.exec(`cat ${path}/${templateOutPath} | grep '.default;' | grep -E -o '^(exports.)[a-zA-Z]+' | sed 's/exports.//' `);

  })

program.parse(process.argv)

// const { spawn } = require('child_process');
// const child = spawn(`${__dirname}/shell/test.sh`,[],{
//   shell: true,
// });

// child.on('close', (code) => {
//   console.log(code);
// });