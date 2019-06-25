const fs = require('fs-extra');

module.exports = {
  generatePage,
  generateIndex,
  generateConfig,
  generateFields,
  generateFormPage,
  generateFormIndex,
  generateForm,
};

function generatePage({ filePath, name, parentUpper = '', isUmi = false }) {
  const map = {
    'true': '@/config',
    'false': '@/src/pages',
  };
  return fs.writeFile(filePath,
    `import React from 'react';
import ${name} from '${map[isUmi]}/${parentUpper}${name}';

export default (props) => <${name} />
`
  )
}

function generateIndex({ filePath, name, parentName = '', namespace = name }) {
  return fs.writeFile(filePath,
    `import React from 'react';
import ZEle from 'zero-element';
import config from './config/${parentName}${name}';

export default () => <ZEle namespace="${namespace}" config={config} />
`
  )
}

function generateConfig({ filePath, name }) {
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
              path: '/${name}-add',
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
              path: '/${name}-edit',
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

function generateFields({ filePath }) {
  return fs.writeFile(filePath,
    `module.exports = [
      { field: 'name', label: '名称', type: 'input' },
    ]
`
  )
}

function generateFormPage({ filePath, name, filename, parentUpper = '', isUmi = false }) {
  const map = {
    'true': '@/config',
    'false': '@/src/pages',
  };
  return fs.writeFile(filePath,
    `import React from 'react';
import ${name}Form from '${map[isUmi]}/${parentUpper}.Form/${filename}';

export default (props) => <${name}Form />
`
  )
}

function generateFormIndex({ filePath, name, parentName = '', namespace = name }) {
  return fs.writeFile(filePath,
    `import React from 'react';
import ZEle from 'zero-element';
import config from '../config/${parentName}${name}-form';

export default () => <ZEle namespace="${namespace}" config={config} />
`
  )
}
function generateForm({ filePath }) {
  return fs.writeFile(filePath,
    `{
  "id": 0,
  "title": "画布",
  "type": "Canvas",
  "items": [],
  "finalId": 1,
  "fieldCount": 1
}
`
  )
}