#!/usr/bin/env node

const program = require('commander');
const shell = require('shelljs');
const path = require('path');
const { ls: swaggerLs, format: swaggerFormat } = require('./bin/swagger');

const {
  init: manageInit,
  gen: manageGen,
} = require('./bin/manage');

program
  .name("zero-json")
  .usage("Commands [Options]")
  .version(require('./package').version)
  .description('用于 zero-element 的初始化项目、页面管理')
  .option('-i, --inputPath [inputPath]', '指定输入文件')
  .option('-o, --outPath [outPath]', '命令输出的目录', process.cwd())
  .option('-d, --direct [direct]', '直接进行操作，不提示确认', false)
  .option('--API [API]', '指定操作的 API', '')
  .option('--swagger [swagger]', '指定操作的 swagger 文件目录',
    path.resolve(`./swagger/swagger.json`))

program
  .command('manage <action> [arguments]')
  .description([
    '后台管理项目 工具',
    '  -> manage init <projectName> 初始化一个后台管理项目',
    '  -> manage gen <pageName> 通过路径所在的 json 文件直接生成 CRUD 页面',
  ].join('\n'))
  .action(function () {
    const [action, ...restArg] = arguments;
    const actionMap = {
      'init': (projectName) => {
        manageInit(projectName, program.outPath, program.direct);
      },
      'gen': (pageName) => {
        manageGen(pageName, program.inputPath, program.outPath, replaceAPIRootPath(program.API), program.direct);
      },
    };
    function tipsActionList() {
      console.log('无效的 action\n可选:', Object.keys(actionMap).join(' | '));
    }
    (actionMap[action] || tipsActionList)(...restArg);
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
        swaggerLs(filter, program.dirPath);
      },
      'format': () => {
        swaggerFormat(program.dirPath);
      },
    };
    function tipsActionList() {
      console.log('无效的 action\n可选:', Object.keys(actionMap).join(' | '));
    }
    (actionMap[action] || tipsActionList)(...restArg);
  })

program.parse(process.argv)


/**
 * git shell 会把 / 解析为根绝对路径
 * @param {string} pageName 
 */
function replaceGitShellRootPath(pageName) {
  if (shell.env.EXEPATH) {
    return pageName.replace(shell.env.EXEPATH.replace(/\\/g, '/'), '').replace(/^\'{0,1}([\w\/]+)\'{0,1}$/, '$1');
  }
  return pageName;
}

function replaceAPIRootPath(API) {
  if (shell.env.EXEPATH) {
    return API.replace(shell.env.EXEPATH.replace(/\\/g, '/'), '');
  }
  return API;
}