const fs = require('fs-extra');

module.exports = {
  generatePage,
  generateIndex,
  generateConfig,
};

function generatePage({ filePath, name, parentsUpper = '', isUmi = false }) {
  const map = {
    'true': '@/config',
    'false': '@/src/pages',
  };
  return fs.writeFile(filePath,
    `import React from 'react';
import ${name} from '${map[isUmi]}/${parentsUpper}${name}';

export default (props) => <${name} />
`
  )
}

function generateIndex({ filePath, name, namespace = name }) {
  return fs.writeFile(filePath,
    `import React from 'react';
import ZEle from 'zero-element';
import config from './config/${name}';

export default () => <ZEle namespace="${namespace}" config={config} />
`
  )
}

function generateConfig({ filePath }) {
  return fs.writeFile(filePath,
    `module.exports = {
  layout: 'Content',
  title: '管理页面',
  items: [
    {
      layout: 'Empty',
      component: 'BaseSearch',
      config: {
        fields: [
          { field: 'name', label: '名字', type: 'input' }
        ],
      },
    },
    {
      layout: 'Empty',
      component: 'BaseList',
      config: {
        API: {
          listAPI: '/api/test',
        },
        actions: [
          {
            title: '新增', type: 'path',
            options: {
              path: '/form',
            },
          }
        ],
        fields: [
          { field: 'title', label: '名称' },
        ],
        operation: [
          {
            title: '编辑', action: 'path',
            options: {
              outside: true,
              path: '/editForm',
            },
          },
        ]
      },
    },
  ],
};
`
  )
}