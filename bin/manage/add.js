
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const confirm = require('../../utils/confirm');

module.exports = function (pageName, dirPath, API, direct) {
  const spinner = ora(`新增后台管理页面： ${pageName}`).start();
  const fileName = pageName.replace(/^\S/, (s) => s.toUpperCase());
  
  const pagesPath = path.join(dirPath, '/pages');
  const srcPath = path.join(dirPath, '/src', 'pages', fileName);
  fs.ensureDir(pagesPath);
  fs.ensureDir(path.join(srcPath, 'config'));

  confirm(
    fs.existsSync(path.join(pagesPath, `${pageName}.js`)),
    function () {
      const rst = Promise.all([
        generatePage(path.join(pagesPath, `${pageName}.js`), fileName),
        generateIndex(path.join(srcPath, 'index.js'), pageName),
        generateConfig(path.join(srcPath, 'config', 'index.js')),
        generateList(path.join(srcPath, 'config', 'list.js')),
      ]);
      rst.then(_=> {
        spinner.succeed(`成功`);
        process.exit();
      })
    },
    {
      message: '页面已存在，是否覆盖？',
      direct: direct,
    }
  );
  return;
}

function generatePage(filePath, name) {
  return fs.writeFile(filePath, `
import React from 'react';
import ${name} from '@/src/${name}';

export default (props) => <${name} />
`
  )
}

function generateIndex(filePath, name) {
  return fs.writeFile(filePath, `
import React from 'react';
import ZEle from 'zero-element';
import config from './config';

export default () => <ZEle namespace="${name}" config={config} />
`
  )
}

function generateConfig(filePath) {
  return fs.writeFile(filePath, `
const config = {
  layout: 'Content',
  title: '管理页面',
  items: [],
};

const list = require('./list');
config.items.push(...list);
module.exports = config;
`
  )
}

function generateList(filePath) {
  return fs.writeFile(filePath, `
module.exports = [
  {
    layout: 'Empty',
    component: 'BaseSearch',
    config: {
      fields: [
        { field: 'name', label: '名字', type: 'input' }
      ],
    },
  }
]
`
  )
}