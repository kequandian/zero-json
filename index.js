#!/usr/bin/env node

const program = require('commander');
const shell = require('shelljs');

const {
  init: manageInit,
  add: manageAdd,
  remove: manageRemove,
  endpoint: manageEndpoint
} = require('./bin/manage');

program
  .version(require('./package').version)
  .description('修改 json 文件，完成模板编辑')
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
    '  -> manage remove <pageName> 移除页面',
    '  -> manage endpoint <endpoint> 移除页面',
  ].join('\n'))
  .action(function () {
    const [action, ...restArg] = arguments;
    const actionMap = {
      'init': (projectName) => {
        manageInit(projectName, program.dirPath, program.direct);
      },
      'add': (pageName) => {
        const pageNameF = pageName.replace(shell.env.EXEPATH.replace(/\\/g, '/'), '');
        const API = program.API.replace(shell.env.EXEPATH.replace(/\\/g, '/'), '');
        manageAdd(pageNameF, program.dirPath, API, program.direct);
      },
      'remove': (pageName) => {
        manageRemove(pageName, program.dirPath, program.direct);
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
        console.log('无效的 action。可选 init | add | remove | endpoint');
      },
    };
    (actionMap[action] || actionMap[undefined])(...restArg);
  })

program.parse(process.argv)