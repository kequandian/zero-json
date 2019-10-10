const fs = require('fs-extra');
const path = require('path');

module.exports = {
  generatePage,
  generateIndex,
  generateConfig,
  generateFields,
  generateFormPage,
  generateFormIndex,
  generateFormJSON,
  generateForm,
  generateAPIFile,
};

/**
 * 用于路由，故文件名 filePath 需要小写
 * @param {*} param0 
 */
function generatePage({ filePath, name, parents = '', isUmi = false }) {
  const map = {
    'true': '@/config',
    'false': '@/src/pages',
  };
  return fs.writeFile(filePath,
    `import React from 'react';
import ${name} from '${map[isUmi]}/${parents}${name}';

export default (props) => <${name} />;
`
  )
}

function generateIndex({ filePath, name, namespace = name }) {

  return fs.writeFile(filePath,
    `import React from 'react';
import ZEle from 'zero-element';
import config from './config/${name}';

export default () => <ZEle namespace="${namespace}" config={config} />;
`
  )
}

function generateConfig({ filePath, name, apiFileName }) {
  fs.ensureDirSync(path.dirname(filePath));

  return fs.writeFile(filePath,
    `const API = require('./.API/${apiFileName}.api.js');

module.exports = {
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
          listAPI: API.listAPI,
        },
        actions: [
          {
            title: '新增', type: 'path',
            options: {
              path: '/${name}-add',
            },
          }
        ],
        fields: 
        // zero_fields_start
        [
          { "field": "title", "label": "名称" }
        ]
        // zero_fields_end
        ,
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
  fs.ensureDirSync(path.dirname(filePath));

  return fs.writeFile(filePath,
    `module.exports = [
      { field: 'name', label: '名称', type: 'input' },
    ]
`
  )
}

function generateFormPage({ filePath, name, filename, parentUpper = '', isUmi = false }) {
  fs.ensureDirSync(path.dirname(filePath));

  const map = {
    'true': '@/config',
    'false': '@/src/pages',
  };
  return fs.writeFile(filePath,
    `import React from 'react';
import ${name}Form from '${map[isUmi]}/${parentUpper}.Form/${filename}';

export default (props) => <${name}Form />;
`
  )
}

function generateFormIndex({ filePath, name, parentName = '', namespace = name }) {
  fs.ensureDirSync(path.dirname(filePath));

  return fs.writeFile(filePath,
    `import React from 'react';
import ZEle from 'zero-element';
import config from '${parentName}form.js';

export default () => <ZEle namespace="${namespace}" config={config} />;
`
  )
}
function generateFormJSON({ filePath }) {
  fs.ensureDirSync(path.dirname(filePath));

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

function generateForm({ filePath, apiFileName }) {
  fs.ensureDirSync(path.dirname(filePath));

  return fs.writeFile(filePath,
    `const API = require('../.API/${apiFileName}.api.js');

module.exports = {
  "layout": "Content",
  "title": "表单",
  "items": []
}
`
  )
}

function generateAPIFile({ filePath }) {
  fs.ensureDirSync(path.dirname(filePath));

  return fs.writeFile(filePath,
    `module.exports = {
  "listAPI": "",
  "getAPI": "",
  "createAPI": "",
  "updateAPI": "",
}
`
  )
}