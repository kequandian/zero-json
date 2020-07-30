const fs = require('fs-extra');
const path = require('path');

module.exports = {
  generateIndex,
  generateTableConfig,
  generateAddFormConfig,
  generateEditFormConfig,
  generateSettingFile,
};

function generateIndex({ filePath, namespace, type }) {

  return fs.writeFile(filePath,
    `import React from 'react';
import ZEle from 'zero-element';
import config from './config/${type}';

export default () => <ZEle namespace="${namespace}" config={config} />;
`
  )
}

function generateTableConfig({ filePath, name }) {

  return fs.writeFile(filePath,
    `const setting = require('./${name}-setting.json');

module.exports = {
  layout: 'TitleContent',
  title: setting.pageName,
  items: [
    {
      component: 'Search',
      config: {
        fields: setting.searchFields,
      },
    },
    {
      component: 'Table',
      config: {
        API: {
          listAPI: setting.listAPI,
          deleteAPI: setting.deleteAPI,
        },
        actions: [
          {
            title: '新增', type: 'path',
            options: {
              path: '${name}/${name}-add',
            },
          }
        ],
        fields: setting.tableFields,
        operation: [
          {
            title: '编辑', action: 'path',
            options: {
              outside: true,
              path: '${name}/${name}-edit',
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

function generateAddFormConfig({ filePath, name }) {

  return fs.writeFile(filePath,
    `const setting = require('./${name}-setting.json');

module.exports = {
  layout: 'TitleContent',
  title: '新增' + setting.pageName,
  items: [
    {
      component: 'Form',
      config: {
        API: {
          createAPI: setting.createAPI,
        },
        fields: setting.formFields,
      },
    },
  ],
};
`
  )
}

function generateEditFormConfig({ filePath, name }) {

  return fs.writeFile(filePath,
    `const setting = require('./${name}-setting.json');

module.exports = {
  layout: 'TitleContent',
  title: '编辑' + setting.pageName,
  items: [
    {
      component: 'Form',
      config: {
        API: {
          getAPI: setting.getAPI,
          updateAPI: setting.updateAPI,
        },
        fields: setting.formFields,
      },
    },
  ],
};
`
  )
}

function generateSettingFile({ filePath, data }) {
  fs.ensureDirSync(path.dirname(filePath));

  return fs.writeJson(filePath, data)
}