#!/usr/bin/env node

const program = require('commander');
const shell = require('shelljs');
const path = require('path');
const { ls: swaggerLs, format: swaggerFormat, json: swaggerJson } = require('./bin/swagger');

const {
  init: manageInit,
  crud: manageCrud,
  category: manageCategory,
} = require('./bin/manage');

const {
  create: routerCreate,
  remove: routerRemove,
} = require('./bin/router');

const { spawn } = require('child_process');

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
    '  -> manage crud <pageName> 通过指定的 BUILD JSON 文件直接生成 CRUD 页面',
    '  -> manage category <pageName> <scope> [...opt] 通过指定的 BUILD JSON 文件生成带有分类功能的 CRUD 页面',
  ].join('\n'))
  .action(function () {
    const [action, ...restArg] = arguments;
    const actionMap = {
      'init': (projectName) => {
        manageInit(projectName);
      },
      'crud': (pageName) => {
        manageCrud(pageName, replaceAPIRootPath(program.API));
      },
      'category': (pageName, Command) => {
        manageCategory(pageName, Command.parent.rawArgs[5], replaceAPIRootPath(program.API));
      },
    };
    (actionMap[action] || tipsActionList.bind(null, actionMap))(...restArg);
  })

program
  .command('swagger <action> [arguments]')
  .description([
    'swagger 工具',
    '  -> swagger ls [filter] 列出 swagger 可用的 API',
    '  -> swagger format 重新 format swagger.json 文件',
    '  -> swagger json [fileName] 生成一个 BUILD JSON 文件',
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
      'json': (fileName) => {
        swaggerJson(fileName, replaceAPIRootPath(program.API));
      },
    };
    (actionMap[action] || tipsActionList.bind(null, actionMap))(...restArg);
  })

program
  .command('mock <port>')
  .description([
    '基于 BUILD JSON 来启动一个简单的 mock 服务器',
  ].join('\n'))
  .action(function () {
    const [port] = arguments;
    const defaultJSONFile = program.inputPath || path.join(process.cwd(), 'build.json');
    const mockPath = path.join(__dirname, './bin/mock');

    const ls = spawn('node', [mockPath, defaultJSONFile, port]);

    ls.stdout.on('data', (data) => {
      console.log(`${data}`);
    });

    ls.stderr.on('data', (data) => {
      console.error(`mock err: ${data}`);
    });
  })

program
  .command('router <action> [arguments]')
  .description([
    'router 文件处理工具',
    '  -> router create [routePath] [routeName] 创建一条新路由, 或修改已有路由的名称',
    '  -> router remove [routePath] 移除已有的路由',
  ].join('\n'))
  .action(function () {
    const [action, ...restArg] = arguments;
    const actionMap = {
      'create': (routePath, Command) => {
        const routeName = Command.parent.rawArgs[5];
        if (/^\w+\/{0,1}\w{0,}$/.test(routePath)) {
          routerCreate(routeName, routePath);
        } else {
          console.log(`zero-json router create ${routeName} [routePath]\n`);
          console.log(`非法的 routePath 格式, 预期输入格式 myPages/myPage 或 myPage, 实际输入: `, routePath);
        }
      },
      'remove': (routePath) => {
        if (/^\w+\/{0,1}\w{0,}$/.test(routePath)) {
          routerRemove(routePath);
        } else {
          console.log(`zero-json router remove [routePath]\n`);
          console.log(`非法的 routePath 格式, 预期输入格式 myPages/myPage 或 myPage, 实际输入: `, routePath);
        }
      }
    };
    (actionMap[action] || tipsActionList.bind(null, actionMap))(...restArg);
  })

program.parse(process.argv)


function tipsActionList(actionMap) {
  console.log('无效的 action\n可选:', Object.keys(actionMap).join(' | '));
}
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