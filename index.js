#!/usr/bin/env node

const program = require('commander');
const shell = require('shelljs');

const {
  init: manageInit,
  add: manageAdd,
  form: manageForm,
  remove: manageRemove,
  endpoint: manageEndpoint
} = require('./bin/manage');

const {
  init: moduleInit,
} = require('./bin/module');

program
  .version(require('./package').version)
  .description('初始化项目、页面管理')
  .option('-f, --filePath [filePath]', '命令所操作的文件')
  .option('-d, --direct [direct]', '直接进行操作，不提示确认', false)
  .option('-p, --dirPath [dirPath]', '命令所操作的目录', process.cwd())
  .option('--API [API]', '指定操作的 API', '')

program
  .command('manage <action> [arguments]')
  .description([
    '后台管理项目 工具',
    '  -> manage init <projectName> 初始化一个后台管理项目',
    '  -> manage add <pageName> 添加页面',
    '  -> manage form <pageName> 直接添加页面对应的表单页面',
    '  -> manage remove <pageName> 移除页面',
    '  -> manage endpoint <endpoint> 编辑 endpoint',
  ].join('\n'))
  .action(function () {
    const [action, ...restArg] = arguments;
    const actionMap = {
      'init': (projectName) => {
        manageInit(projectName, program.dirPath, program.direct);
      },
      'add': (pageName) => {
        const pageNameF = pageName.replace(shell.env.EXEPATH.replace(/\\/g, '/'), '').replace(/^\'{0,1}([\w\/]+)\'{0,1}$/, '$1');
        const API = program.API.replace(shell.env.EXEPATH.replace(/\\/g, '/'), '');
        manageAdd(pageNameF, program.dirPath, API, program.direct);
      },
      'form': (pageName) => {
        const pageNameF = pageName.replace(shell.env.EXEPATH.replace(/\\/g, '/'), '').replace(/^\'{0,1}([\w\/]+)\'{0,1}$/, '$1');
        manageForm(pageNameF, program.dirPath, program.direct);
      },
      'remove': (pageName) => {
        const pageNameF = pageName.replace(shell.env.EXEPATH.replace(/\\/g, '/'), '').replace(/^\'{0,1}([\w\/]+)\'{0,1}$/, '$1');
        manageRemove(pageNameF, program.dirPath, program.direct);
      },
      'endpoint': async (endpoint) => {
        if (endpoint) {
          await manageEndpoint(endpoint);
          console.log('endpoint 已配置');
        } else {
          console.log('请输入 endpoint');
          console.log('e.g.');
          console.log("    zero-json manage endpoint 'http://example.com:8080'");
        }
      },
      'undefined': () => {
        console.log('无效的 action。可选 init | add | form | remove | endpoint');
      },
    };
    (actionMap[action] || actionMap[undefined])(...restArg);
  })

program
  .command('module <action> [arguments]')
  .description([
    '后台管理模块 工具',
    '  -> module init <moduleName> 初始化一个后台管理模块',
  ].join('\n'))
  .action(function () {
    const [action, ...restArg] = arguments;
    const actionMap = {
      'init': (moduleName) => {
        moduleInit(moduleName, program.dirPath, program.direct);
      }
    };
    (actionMap[action] || actionMap[undefined])(...restArg);
  })

program.parse(process.argv)